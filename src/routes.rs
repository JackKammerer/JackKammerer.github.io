use crate::structs::*;
use crate::randstrings::*;
use crate::jwe::*;
use crate::error_types::{
    MiddlewareError, RouteError, RouteErrorText
};
use crate::template_structs::*;

use axum::{
    extract::{
        Extension, 
        Json, 
        Request, 
        State
    }, 
    http::{
        self, header::{self, HeaderMap}, HeaderValue, StatusCode
    }, 
    middleware::Next, 
    response::{
        Html, IntoResponse, Redirect, Response
    }, 
    BoxError, 
};


use reqwest::header::{AUTHORIZATION, USER_AGENT};
use tokio::try_join;


use sqlx::{query, query_as, Pool, Postgres};

use sha2::{Sha512, Digest};
use anyhow::Context;
use askama::Template;

use std::{
    fs, str, sync::{Arc, RwLock}, time::SystemTime
};

type SharedState = Arc<RwLock<ApplicationState>>;


pub async fn register(state: SharedState, login_packet : LoginPacket) -> bool {
    let username = login_packet.username;
    let password = login_packet.password;

    let mut hash_function = Sha512::new();
    hash_function.update(password.as_bytes());
    let salt = generate_salt();
    hash_function.update(salt.clone());
    let result = hash_function.finalize();

    let password_hash = base64_url::encode(&result);
    let salt_hash = base64_url::encode(&salt);

    let database: Pool<Postgres>; 

    {
        database = state.read().unwrap().db.clone();
    } 

    let query_result = query!(
        "INSERT INTO accounts (username, password, salt) VALUES($1, $2, $3) ON CONFLICT(username) DO NOTHING",
        username, password_hash, salt_hash 
    )
    .execute(&database)
    .await;

    if let Err(_) = query_result {
        return false;
    };

    true
}

pub async fn get_jwe(Extension(state): Extension<SharedState>, Json(json): Json<LoginPacket>) -> Result<Response, RouteError> {

    let username = json.username;
    let sub = username.clone();

    let password = json.password;

    let database: Pool<Postgres>; 

    {
        database = state.read().unwrap().db.clone();
    } 

    let query_result = sqlx::query_as!(
        UserAccountSchema,
        "SELECT * FROM accounts WHERE username = $1",
        username,
    )
    .fetch_one(&database)
    .await?;

    let salt_bytes = base64_url::decode(&query_result.salt)?;

    let mut hash_function = Sha512::new();
    hash_function.update(password.as_bytes());
    hash_function.update(salt_bytes);
    let result = hash_function.finalize();

    let result_value = base64_url::encode(&result);

    if result_value != query_result.password {
        return Err(RouteErrorText::new("Invalid Password").into())
    }

    let iat_value: u64 = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH)?.as_secs(); 


    let reader_result = state.read();
    if let Err(_) = reader_result {
        return Err(RouteErrorText::new("Unable to generate token").into());
    }

    let reader = reader_result.unwrap();

    let iss_string = reader.issuer.clone();
    let session_time = reader.session_time;
    let exp_value = iat_value + session_time;

    let iss = &iss_string;

    let iat = iat_value.to_string();
    let exp = exp_value.to_string();

    let xsrf = base64_url::encode(&generate_xsrf());

    let jwe = generate_jwe(Extension(state.clone()), &iss, &sub, &iat, &exp, &xsrf)?;

    let mut headers = HeaderMap::new();
    headers.insert(header::CONTENT_TYPE, "text/plain".parse().unwrap());
    headers.insert(header::SET_COOKIE, format!("jwe={jwe}; Max-Age= {session_time}; HttpOnly; SameSite=Strict; Secure").parse().unwrap());
    headers.insert("X-XSRF-TOKEN", format!("xsrf={xsrf}").parse().unwrap());

    Ok(
        (
            StatusCode::OK,
            headers,
            "Ok",
        ).into_response()
    )
}


pub async fn authenticate_request(
    State(state): State<SharedState>,
    request: Request, 
    next: Next
) -> Result<Response, MiddlewareError> {

    if request.uri().path() == "/private/login" || request.uri().path() == "/github-content" || request.uri().path() == "/getjwe" || String::from(request.uri().path()).starts_with("/models") || String::from(request.uri().path()).starts_with("/images") || String::from(request.uri().path()).starts_with("/dist") || request.uri().path() == "/" {
        let response = next.run(request).await;
        return Ok(response)
    }

    let headers = request.headers();

    let cookie = headers.get(header::COOKIE).context("No cookie value")?.to_str()?;

    let jwe_cookie_full = String::from(cookie);
    let jwe_cookie_elems: Vec<&str> = jwe_cookie_full.split("=").collect();
    let jwe_cookie_value: String;
    
    if jwe_cookie_elems.len() > 1 {
        jwe_cookie_value = String::from(jwe_cookie_elems[1]);
    } else {
        return Err(RouteErrorText::new("Cookie error").into());
    }
    
    let private_key: String;
    let mac_key: String;

    {
        let reader = match state.read() {
            Ok(result) => result,
            Err(_) => return Err(RouteErrorText::new("Cookie error").into())
        };

        private_key = reader.rsa_private_key.clone();
        mac_key = reader.mac_key.clone();
    }

    let token_content = validate_jwe(private_key, mac_key, jwe_cookie_value)?;

    let body_json: JWTBody = serde_json::from_str(&token_content)?; 

    let current_time = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH)?.as_secs(); 

    let expiry_time= str::parse::<u64>(&body_json.exp)?;

    let expected_username = std::env::var("ADMIN_ACCOUNT_USERNAME").expect("Need to provide Adminm account username");

    if request.method() == http::Method::GET {
        if body_json.iss == "jackkammerer.com" && body_json.sub == expected_username && expiry_time > current_time {
            return Ok(next.run(request).await);
        }
    }

    else if request.method() == http::Method::POST {
        let xsrf_cookie_option = headers.get("X-XSRF-TOKEN");
        if let None = xsrf_cookie_option {
            return Err(RouteErrorText::new("Invalid XSRF cookie").into());
        } 

        let xsrf_cookie_full = String::from(xsrf_cookie_option.unwrap().to_str()?);
        let xsrf_cookie_elems: Vec<&str> = xsrf_cookie_full.split("=").collect(); 
        let xsrf_cookie_value: String;

        if xsrf_cookie_elems.len() > 1 {
            xsrf_cookie_value = String::from(xsrf_cookie_elems[1]);
        } else {
            return Err(RouteErrorText::new("Cookie error").into());
        }

        if body_json.xsrf == xsrf_cookie_value && body_json.sub == expected_username && expiry_time > current_time {
            return Ok(next.run(request).await);
        }       
    }
        
    return Err(RouteErrorText::new("Cookie error").into());
}




pub async fn get_contact_data(state: SharedState, for_editor: bool) -> Result<String, anyhow::Error> {

    let database: Pool<Postgres>; 

    {
        database = state.read().unwrap().db.clone();
    }

    let contacts = query_as!(
        ContactsItem,
        "SELECT id, contact_name, link_name, image_name FROM contacts"
    )
    .fetch_all(&database)
    .await?;

    if for_editor {
        let contacts_template = ContactsTemplateEditor { contacts };

        return Ok(contacts_template.render().unwrap());
    } 

    let contacts_template = ContactsTemplate { contacts };

    Ok(contacts_template.render().unwrap())
}

pub async fn get_school_data(state: SharedState, for_editor: bool) -> Result<String, anyhow::Error> {

    let database: Pool<Postgres>; 

    {
        database = state.read().unwrap().db.clone();
    }

    let schools_future = query_as!(
        SchoolItem,
        "SELECT id, school_name, school_dates, degree, awards FROM schoolData"
    )
    .fetch_all(&database);

    if for_editor {
        let schools = schools_future.await?;

        let schools_template = SchoolDataEditor {schools};

        return Ok(schools_template.render().unwrap());
    }

    let images_future = query_as!(
        ArrayData,
        "SELECT items FROM arrayData WHERE label = $1",
        "schoolImagesList"
    )
    .fetch_one(&database);

    let (schools, images) = try_join!(schools_future, images_future)?;

    let schools_template = SchoolTemplate {schools, images: images.items};

    Ok(schools_template.render().unwrap())
}



pub async fn get_achievements_data(state: SharedState, for_editor: bool) -> Result<String, anyhow::Error> {

    let database: Pool<Postgres>; 

    {
        database = state.read().unwrap().db.clone();
    }

    let achievement_content_future = query_as!(
        AchievementsTemplateEditor, 
        "SELECT id, items FROM arrayData WHERE label = $1",
        "achievementList"
    )
    .fetch_one(&database);

    if for_editor {
        let achievements_content = achievement_content_future.await?;

        return Ok(achievements_content.render().unwrap());
    }



    let left_images_future = query_as!(
        ArrayData, 
        "SELECT items FROM arrayData WHERE label = $1",
        "leftAchievementImageList"
    )
    .fetch_one(&database);

    let right_images_future = query_as!(
        ArrayData, 
        "SELECT items FROM arrayData WHERE label = $1",
        "rightAchievementImageList"
    )
    .fetch_one(&database);

    let (left_images, right_images, achievement_content) = try_join!(left_images_future, right_images_future, achievement_content_future)?;

    let achievements_template = AchievementsTemplate {left_images: left_images.items, right_images: right_images.items, achievements_content: achievement_content.items};

    Ok(achievements_template.render().unwrap())
}

pub async fn get_work_data(state: SharedState, is_mobile: bool, for_editor: bool) -> Result<String, anyhow::Error> {

    let database: Pool<Postgres>; 

    {
        database = state.read().unwrap().db.clone();
    }

    let jobs = query_as!(
        Job,
        "SELECT id, position, company, dates, details FROM workData"
    )
    .fetch_all(&database)
    .await?;

    if for_editor {
        let work_template = WorkTemplateEditor { jobs };

        Ok(work_template.render().unwrap())

    } else {
        let work_template = WorkTemplate {is_mobile: is_mobile, jobs};

        Ok(work_template.render().unwrap())
    }
}

pub async fn get_project_data(state: SharedState, for_editor: bool) -> Result<String, anyhow::Error> {

    let database: Pool<Postgres>; 

    {
        database = state.read().unwrap().db.clone();
    }

    let projects = query_as!(
        CustomProject,
        "SELECT id, project_name, project_description, github_repo, image_link, tools_used FROM projectData"
    )
    .fetch_all(&database)
    .await?;

    if for_editor {
        let project_template = ProjectsTemplateEditor {projects};

        Ok(project_template.render().unwrap())

    } else {
        let project_template = ProjectsTemplate {projects};

        Ok(project_template.render().unwrap())
    }
}

pub async fn get_tools_data(state: SharedState, for_editor: bool) -> Result<String, anyhow::Error> {

    let database: Pool<Postgres>; 

    {
        database = state.read().unwrap().db.clone();
    }

    if for_editor {
        let tools_template = query_as!(
            ToolsTemplateEditor,
            "SELECT id, items FROM arrayData WHERE label=$1",
            "toolList"
        )
        .fetch_one(&database)
        .await?;

        return Ok(tools_template.render().unwrap());
    }

    let tools_template = query_as!(
        ToolsTemplate,
        "SELECT items FROM arrayData WHERE label=$1",
        "toolList"
    )
    .fetch_one(&database)
    .await?;

    Ok(tools_template.render().unwrap())
}


pub async fn get_github_content() -> Result<String, anyhow::Error> {

    let client = reqwest::Client::new();

    let url = "https://api.github.com/users/JackKammerer/repos?per_page=100&type=public";
    let mut headers = HeaderMap::new();
    headers.insert(AUTHORIZATION, HeaderValue::from_str(std::env::var("API_GITHUB_KEY")?.as_str())?);
    headers.insert(USER_AGENT, HeaderValue::from_static("reqwest"));

    let projects: Vec<GithubProject> = client
    .get(url)
    .headers(headers)
    .send()
    .await?
    .json()
    .await?;

    let github_template = GithubContentTemplate {projects};

    Ok(github_template.render().unwrap())
}

pub async fn get_github_content_http() -> Result<Html<String>, StatusCode> {

    match get_github_content().await {
        Ok(content) => {
            return Ok(Html(content))
        },
        Err(_) => {
            return Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}


pub async fn show_home_page(State(state): State<SharedState>, headers: HeaderMap) -> Html<String> {

    let is_mobile_user_agent: bool;

    if let Some(user_agent) = headers.get("user-agent") {
        if let Ok(user_agent_string) = user_agent.to_str() {
            is_mobile_user_agent = String::from(user_agent_string).contains("mobile");
        }
        else {
            is_mobile_user_agent = false;
        }
    } else {
        is_mobile_user_agent = false;
    } 


    let page_links = vec!["Introduction", "School", "Work", "Projects", "Tools", "Contact"];
    let navbar = NavbarTemplate{links: page_links};


    let school_content_future = get_school_data(state.clone(), false);
    let achievements_content_future= get_achievements_data(state.clone(), false);
    let work_content_future = get_work_data(state.clone(), is_mobile_user_agent, false);
    let project_content_future= get_project_data(state.clone(), false);
    let tools_content_future= get_tools_data(state.clone(), false);
    let contacts_content_future= get_contact_data(state.clone(), false);

    let join_result = try_join!(school_content_future, achievements_content_future, work_content_future, project_content_future, tools_content_future, contacts_content_future);


    match join_result {
        Ok((school_content, achievements_content, work_content, project_content, tools_content, contacts_content)) => {

            let homepage = HomeTemplate { is_mobile: is_mobile_user_agent, navbar: navbar, schools: school_content, achievements: achievements_content, work: work_content, projects: project_content, tools: tools_content, contacts: contacts_content};

            return Html(homepage.render().unwrap())
        },
        Err(error) => {
            return Html(error.to_string());
        }
    }
}

pub async fn server_admin_page(State(state): State<SharedState>) -> Html<String>{
    let school_editor_content_future = get_school_data(state.clone(), true);
    let achievement_editor_content_future = get_achievements_data(state.clone(), true);
    let work_editor_content_future = get_work_data(state.clone(), false, true);
    let project_editor_content_future = get_project_data(state.clone(), true);
    let tool_editor_content_future = get_tools_data(state.clone(), true);
    let contact_editor_content_future = get_contact_data(state.clone(), true);

   
    let editor_result = try_join!(school_editor_content_future, achievement_editor_content_future, work_editor_content_future, project_editor_content_future, tool_editor_content_future, contact_editor_content_future);
    
    match editor_result {
        Ok((school_data, achievement_data, work_data, project_data, tool_data, contact_data)) => {
            let editor_page = AdminEditor {school_data, achievement_data, work_data, project_data, tool_data, contact_data};

            return Html(editor_page.render().unwrap());
        },
        Err(error) => {
            return Html(error.to_string());
        }
    }
}


pub async fn handle_error(_: BoxError)  -> Response {
    Redirect::to("/private/login").into_response()
}


pub async fn update_content(State(state): State<SharedState>, Json(json_content): Json<Vec<serde_json::Value>>) -> StatusCode {

    let database: Pool<Postgres>; 

    {
        database = state.read().unwrap().db.clone();
    }

    for database_change in json_content {

        if let Ok(school_item) = serde_json::from_value::<SchoolItemClientInput>(database_change.clone()) {
            if let Err(_) = school_item.run_query(&database).await {
                return StatusCode::INTERNAL_SERVER_ERROR;
            }
        }
        else if let Ok(achievement_item) = serde_json::from_value::<ArrayDataItemClientInput>(database_change.clone()) {
            if let Err(_) = achievement_item.run_query(&database).await {
                return StatusCode::INTERNAL_SERVER_ERROR;
            }
        }
        else if let Ok(work_item) = serde_json::from_value::<WorkItemClientInput>(database_change.clone()) {
            if let Err(_) = work_item.run_query(&database).await {
                return StatusCode::INTERNAL_SERVER_ERROR;
            }
        }
        else if let Ok(project_item) = serde_json::from_value::<ProjectItemClientInput>(database_change.clone()) {
            if let Err(_) = project_item.run_query(&database).await {
                return StatusCode::INTERNAL_SERVER_ERROR;
            }
        }
        else if let Ok(contact_item) = serde_json::from_value::<ContactItemClientInput>(database_change.clone()) {
            if let Err(_) = contact_item.run_query(&database).await {
                return StatusCode::INTERNAL_SERVER_ERROR;
            }
        }
        else {
            return StatusCode::BAD_REQUEST;
        }
    }

    StatusCode::OK
}

pub async fn render_login_page() -> Html<String> {
    match fs::read_to_string("./dist/login.html") {
        Ok(file) => return Html(file),
        Err(_) => return Html(String::from("Error retrieving login page - Please try again later!"))
    };
}