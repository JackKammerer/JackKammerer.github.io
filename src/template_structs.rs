use anyhow::Error;
use askama::Template;
use serde::Deserialize;
use sqlx::{postgres::PgQueryResult, query, Pool, Postgres};
use uuid::Uuid;
use html_escape::encode_text_to_string;

#[derive(Template)]
#[template(path="admin.html")]
pub struct AdminEditor {
    pub school_data: String,
    pub achievement_data: String,
    pub work_data: String,
    pub project_data: String,
    pub tool_data: String,
    pub contact_data: String
}

#[derive(Template)]
#[template(path="schoolDataEditor.html")]
pub struct SchoolDataEditor {
    pub schools: Vec<SchoolItem>
}

#[derive(Template)]
#[template(path="achievementDataEditor.html")]
pub struct AchievementsTemplateEditor {
    pub id: String,
    pub items: Vec<String>
}

#[derive(Template)]
#[template(path="workDataEditor.html")]
pub struct WorkTemplateEditor {
    pub jobs: Vec<Job>
}

#[derive(Template)]
#[template(path="projectDataEditor.html")]
pub struct ProjectsTemplateEditor {
    pub projects: Vec<CustomProject>
}


#[derive(Template)]
#[template(path="toolDataEditor.html")]
pub struct ToolsTemplateEditor {
    pub id: String,
    pub items: Vec<String>
}

#[derive(Template)]
#[template(path="contactDataEditor.html")]
pub struct ContactsTemplateEditor {
    pub contacts: Vec<ContactsItem>,
}







#[derive(Template)]
#[template(path="home.html")]
pub struct HomeTemplate <'a> {
    pub is_mobile: bool,
    pub navbar: NavbarTemplate<'a>,
    pub schools: String, 
    pub achievements: String,
    pub work: String, 
    pub projects: String,
    pub tools: String,
    pub contacts: String 
}


#[derive(Template)]
#[template(path="contacts.html")]
pub struct ContactsTemplate {
    pub contacts: Vec<ContactsItem>,
}

pub struct ContactsItem {
    pub id: String,
    pub contact_name: String,
    pub link_name: String,
    pub image_name: String,

}


#[derive(Template)]
#[template(path="school.html")]
pub struct SchoolTemplate {
    pub schools: Vec<SchoolItem>,
    pub images: Vec<String>
}


pub struct SchoolItem {
    pub id: String,
    pub school_name: String,
    pub school_dates: String,
    pub degree: String,
    pub awards: Vec<String>
}

#[derive(Template)]
#[template(path="navbar.html")]
pub struct NavbarTemplate<'a> {
    pub links: Vec<&'a str>
}

#[derive(Template)]
#[template(path="work.html")]
pub struct WorkTemplate {
    pub is_mobile: bool,
    pub jobs: Vec<Job>
}

pub struct Job {
    pub id: String,
    pub position: String,
    pub company: String,
    pub dates: String, 
    pub details: Vec<String>
}

#[derive(Template)]
#[template(path="github.html")]
pub struct GithubTemplate {
    pub projects: Vec<GithubProject>
}

#[derive(Template)]
#[template(path="githubcontent.html")]
pub struct GithubContentTemplate {
    pub projects: Vec<GithubProject>
}

#[derive(Deserialize)]
pub struct GithubProject {
    pub name: String,
    pub description: String,
    pub html_url: String,
    pub language: Option<String>
}

#[derive(Template)]
#[template(path="specialprojects.html")]
pub struct ProjectsTemplate {
    pub projects: Vec<CustomProject>
}

pub struct CustomProject {
    pub id: String,
    pub project_name: String, 
    pub project_description: String,
    pub github_repo: Option<String>,
    pub image_link: String,
    pub tools_used: Vec<String>,
}

#[derive(Template)]
#[template(path="tools.html")]
pub struct ToolsTemplate {
    pub items: Vec<String>
}

#[derive(Template)]
#[template(path="achievements.html")]
pub struct AchievementsTemplate {
    pub left_images: Vec<String>,
    pub achievements_content: Vec<String>,
    pub right_images: Vec<String>,
}

pub struct ArrayData {
    pub items: Vec<String>
}




// Client JSON structs

#[derive(Deserialize, PartialEq)]
#[serde(from = "u8")]
pub enum DatabaseChangeTypes {
    CREATE = 0,
    UPDATE = 1,
    DELETE = 2 
}

impl From<u8> for DatabaseChangeTypes {
    fn from(value: u8) -> Self {
        match value {
            0 => DatabaseChangeTypes::CREATE,
            1 => DatabaseChangeTypes::UPDATE,
            2 => DatabaseChangeTypes::DELETE,
            _ => panic!("Invalid int")
        }
    }
}

pub trait Query {
    async fn run_query(self, database: &Pool<Postgres>) -> Result<PgQueryResult, anyhow::Error>; 
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SchoolItemClientInput {
    pub id: Uuid,
    pub change_type: DatabaseChangeTypes,
    pub school_name: Option<String>,
    pub school_dates: Option<String>,
    pub degree: Option<String>,
    pub awards: Option<Vec<String>>
}

impl Query for SchoolItemClientInput {
    async fn run_query(self, database: &Pool<Postgres>) -> Result<PgQueryResult, anyhow::Error> {

        if self.change_type == DatabaseChangeTypes::CREATE {
            if self.school_name.is_some() && self.school_dates.is_some() && self.degree.is_some() && self.awards.is_some() {

                let mut full_string_name = String::new();
                let mut full_string_dates = String::new();
                let mut full_string_degree = String::new();

                let school_name_string = encode_text_to_string(self.school_name.unwrap(), &mut full_string_name); 
                let school_dates_string = encode_text_to_string(self.school_dates.unwrap(), &mut full_string_dates); 
                let school_degree_string = encode_text_to_string(self.degree.unwrap(), &mut full_string_degree);

                let clean_awards: Vec<String> = self.awards.unwrap().iter().map(|value| { String::from(encode_text_to_string(value, &mut String::new()))}).collect();

                let result = query!(
                    "INSERT INTO schoolData (school_name, school_dates, degree, awards) VALUES ($1, $2, $3, $4)",
                    school_name_string, school_dates_string, school_degree_string, &clean_awards.as_slice(),
                ).execute(database).await?;

                return Ok(result);

            } else {
                return Err(Error::msg("INVALID QUERY CONTENTS"));
            }
        }

        else if self.change_type == DatabaseChangeTypes::UPDATE {
            let school_name_option: Option<&str>;
            let school_dates_option: Option<&str>;
            let school_degree_option: Option<&str>;
            let school_awards_option: Option<Vec<String>>;


            let mut full_string_name = String::new();

            if self.school_name.is_some() {
                school_name_option = Some(encode_text_to_string(self.school_name.unwrap(), &mut full_string_name)); 
            } else {
                school_name_option = None;
            } 


            let mut full_string_dates = String::new();

            if self.school_dates.is_some() {
                school_dates_option = Some(encode_text_to_string(self.school_dates.unwrap(), &mut full_string_dates)); 
            } else {
                school_dates_option = None;
            }


            let mut full_string_degree = String::new();

            if self.degree.is_some() {
                school_degree_option = Some(encode_text_to_string(self.degree.unwrap(), &mut full_string_degree));
            } else {
                school_degree_option = None;
            }

            if self.awards.is_some() {
                let clean_awards: Vec<String> = self.awards.unwrap().iter().map(|value| { String::from(encode_text_to_string(value, &mut String::new()))}).collect();
                school_awards_option = Some(clean_awards);
            } else {
                school_awards_option = None;
            }

            let result = query!(
                "UPDATE schoolData SET school_name = COALESCE($1, school_name), school_dates = COALESCE($2, school_dates), degree = COALESCE($3, degree), awards = COALESCE($4, awards) WHERE id=$5",
                school_name_option, school_dates_option, school_degree_option, school_awards_option.as_deref(), self.id 
            ).execute(database).await?;

            return Ok(result);
        }

        else if self.change_type == DatabaseChangeTypes::DELETE {
            let result = query!(
                "DELETE FROM schoolData WHERE id=$1", self.id 
            ).execute(database).await?;

            return Ok(result);
        }

        Err(Error::msg("INVALID QUERY CONTENTS"))
    }
}



#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArrayDataItemClientInput {
    pub id: Uuid,
    pub items: Vec<String>
}

impl Query for ArrayDataItemClientInput {
    async fn run_query(self, database: &Pool<Postgres>) -> Result<PgQueryResult, anyhow::Error> {

        let clean_array: Vec<String> = self.items.iter().map(|value| { String::from(encode_text_to_string(value, &mut String::new()))}).collect();

        let result = query!(
            "UPDATE arrayData SET items = $1 WHERE id=$2",
            &clean_array, self.id 
        ).execute(database).await?;

        return Ok(result);
    }
}



#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct WorkItemClientInput {
    pub id: Uuid,
    pub change_type: DatabaseChangeTypes,
    pub position: Option<String>,
    pub company: Option<String>,
    pub dates: Option<String>,
    pub details: Option<Vec<String>>
}

impl Query for WorkItemClientInput {
    async fn run_query(self, database: &Pool<Postgres>) -> Result<PgQueryResult, anyhow::Error> {

        if self.change_type == DatabaseChangeTypes::CREATE {
            if self.position.is_some() && self.company.is_some() && self.dates.is_some() && self.details.is_some() {
                let mut full_string_position = String::new();
                let mut full_string_company = String::new();
                let mut full_string_dates = String::new();

                let position_string = encode_text_to_string(self.position.unwrap(), &mut full_string_position); 
                let company_string = encode_text_to_string(self.company.unwrap(), &mut full_string_company); 
                let dates_string = encode_text_to_string(self.dates.unwrap(), &mut full_string_dates);

                let clean_details: Vec<String> = self.details.unwrap().iter().map(|value| { String::from(encode_text_to_string(value, &mut String::new()))}).collect();


                let result = query!(
                    "INSERT INTO workData (position, company, dates, details) VALUES ($1, $2, $3, $4)",
                    position_string, company_string, dates_string, &clean_details
                ).execute(database).await?;

                return Ok(result);

            } else {
                return Err(Error::msg("INVALID QUERY CONTENTS"));
            }
        }

        else if self.change_type == DatabaseChangeTypes::UPDATE {
            let work_position_option: Option<&str>;
            let work_company_option: Option<&str>;
            let work_dates_option: Option<&str>;
            let work_details_option: Option<Vec<String>>;

            let mut full_string_position= String::new();

            if self.position.is_some() {
                work_position_option = Some(encode_text_to_string(self.position.unwrap(), &mut full_string_position)); 
            } else {
                work_position_option = None;
            } 


            let mut full_string_company = String::new();

            if self.company.is_some() {
                work_company_option = Some(encode_text_to_string(self.company.unwrap(), &mut full_string_company)); 
            } else {
                work_company_option = None;
            }


            let mut full_string_dates= String::new();

            if self.dates.is_some() {
                work_dates_option = Some(encode_text_to_string(self.dates.unwrap(), &mut full_string_dates));
            } else {
                work_dates_option = None;
            }


            if self.details.is_some() {
                let clean_details: Vec<String> = self.details.unwrap().iter().map(|value| { String::from(encode_text_to_string(value, &mut String::new()))}).collect();
                work_details_option = Some(clean_details);
            } else {
                work_details_option = None;
            }


            
            let result = query!(
                "UPDATE workData SET position = COALESCE($1, position), company = COALESCE($2, company), dates = COALESCE($3, dates), details = COALESCE($4, details) WHERE id=$5",
                work_position_option, work_company_option, work_dates_option, work_details_option.as_deref(), self.id 
            ).execute(database).await?;

            return Ok(result);
        }

        else if self.change_type == DatabaseChangeTypes::DELETE {
            let result = query!(
                "DELETE FROM workData WHERE id=$1", self.id
            ).execute(database).await?;

            return Ok(result);
        }

        Err(Error::msg("INVALID QUERY CONTENTS"))
    }
}



#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ProjectItemClientInput {
    pub id: Uuid,
    pub change_type: DatabaseChangeTypes,
    pub project_name: Option<String>,
    pub project_description: Option<String>,
    pub image_link: Option<String>,
    pub github_repo: Option<String>,
    pub tools_used: Option<Vec<String>>
}

impl Query for ProjectItemClientInput {
    async fn run_query(self, database: &Pool<Postgres>) -> Result<PgQueryResult, anyhow::Error> {

        if self.change_type == DatabaseChangeTypes::CREATE {
            if self.project_name.is_some() && self.project_description.is_some() && self.image_link.is_some() && self.tools_used.is_some(){

                let mut full_string_project_name= String::new();
                let mut full_string_project_description= String::new();
                let mut full_string_image_link= String::new();

                let project_name_string = encode_text_to_string(self.project_name.unwrap(), &mut full_string_project_name); 
                let project_description_string = encode_text_to_string(self.project_description.unwrap(), &mut full_string_project_description); 
                let image_link_string = encode_text_to_string(self.image_link.unwrap(), &mut full_string_image_link);

                let clean_tools: Vec<String> = self.tools_used.unwrap().iter().map(|value| { String::from(encode_text_to_string(value, &mut String::new()))}).collect();

                let mut full_string_github_repo = String::new();
                let github_repo_option: Option<&str>;

                if self.github_repo.is_some() {
                    github_repo_option = Some(encode_text_to_string(self.github_repo.unwrap(), &mut full_string_github_repo));
                } else {
                    github_repo_option = None;
                }


                let result = query!(
                    "INSERT INTO projectData (project_name, project_description, image_link, github_repo, tools_used) VALUES ($1, $2, $3, $4, $5)",
                    project_name_string, project_description_string, image_link_string, github_repo_option, &clean_tools,
                ).execute(database).await?;

                return Ok(result);

            } else {
                return Err(Error::msg("INVALID QUERY CONTENTS"));
            }
        }

        else if self.change_type == DatabaseChangeTypes::UPDATE {
            let project_name_option: Option<&str>;
            let project_description_option: Option<&str>;
            let image_link_option: Option<&str>;
            let github_repo_option: Option<&str>;
            let tools_used_option: Option<Vec<String>>;


            let mut full_string_project_name= String::new();

            if self.project_name.is_some() {
                project_name_option = Some(encode_text_to_string(self.project_name.unwrap(), &mut full_string_project_name)); 
            } else {
                project_name_option = None;
            } 


            let mut full_string_project_description= String::new();

            if self.project_description.is_some() {
                project_description_option = Some(encode_text_to_string(self.project_description.unwrap(), &mut full_string_project_description)); 
            } else {
                project_description_option = None;
            }


            let mut full_string_image_link= String::new();

            if self.image_link.is_some() {
                image_link_option = Some(encode_text_to_string(self.image_link.unwrap(), &mut full_string_image_link));
            } else {
                image_link_option = None;
            }

            let mut full_string_github_repo = String::new();

            if self.github_repo.is_some() {
                github_repo_option = Some(encode_text_to_string(self.github_repo.unwrap(), &mut full_string_github_repo));
            } else {
                github_repo_option = None;
            }


            if self.tools_used.is_some() {
                let clean_tools_used: Vec<String> = self.tools_used.unwrap().iter().map(|value| { String::from(encode_text_to_string(value, &mut String::new()))}).collect();
                tools_used_option = Some(clean_tools_used);
            } else {
                tools_used_option = None;
            }



            let result = query!(
                "UPDATE projectData SET project_name= COALESCE($1, project_name), project_description = COALESCE($2, project_description), image_link = COALESCE($3, image_link), github_repo = COALESCE($4, github_repo), tools_used = COALESCE($5, tools_used) WHERE id=$6",
                project_name_option, project_description_option, image_link_option, github_repo_option, tools_used_option.as_deref(), self.id 
            ).execute(database).await?;

            return Ok(result);
        }

        else if self.change_type == DatabaseChangeTypes::DELETE {
            let result = query!(
                "DELETE FROM projectData WHERE id=$1", self.id
            ).execute(database).await?;

            return Ok(result);
        }

        Err(Error::msg("INVALID QUERY CONTENTS"))
    }
}



#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ContactItemClientInput {
    pub id: Uuid,
    pub change_type: DatabaseChangeTypes,
    pub contact_name: Option<String>,
    pub link_name: Option<String>,
    pub image_name: Option<String>,
}

impl Query for ContactItemClientInput {
    async fn run_query(self, database: &Pool<Postgres>) -> Result<PgQueryResult, anyhow::Error> {

        if self.change_type == DatabaseChangeTypes::CREATE {
            if self.contact_name.is_some() && self.link_name.is_some() && self.image_name.is_some() {

                let mut full_string_contact_name= String::new();
                let mut full_string_link_name= String::new();
                let mut full_string_image_name= String::new();

                let contact_name_string = encode_text_to_string(self.contact_name.unwrap(), &mut full_string_contact_name); 
                let link_name_string = encode_text_to_string(self.link_name.unwrap(), &mut full_string_link_name); 
                let image_name_string = encode_text_to_string(self.image_name.unwrap(), &mut full_string_image_name);

                let result = query!(
                    "INSERT INTO contacts (contact_name, link_name, image_name) VALUES ($1, $2, $3)",
                    contact_name_string, link_name_string, image_name_string,
                ).execute(database).await?;

                return Ok(result);

            } else {
                return Err(Error::msg("INVALID QUERY CONTENTS"));
            }
        }

        else if self.change_type == DatabaseChangeTypes::UPDATE {
            let contact_name_option: Option<&str>;
            let link_name_option: Option<&str>;
            let image_name_option: Option<&str>;


            let mut full_string_contact_name= String::new();

            if self.contact_name.is_some() {
                contact_name_option = Some(encode_text_to_string(self.contact_name.unwrap(), &mut full_string_contact_name)); 
            } else {
                contact_name_option = None;
            } 


            let mut full_string_link_name= String::new();

            if self.link_name.is_some() {
                link_name_option = Some(encode_text_to_string(self.link_name.unwrap(), &mut full_string_link_name)); 
            } else {
                link_name_option = None;
            }


            let mut full_string_image_name= String::new();

            if self.image_name.is_some() {
                image_name_option = Some(encode_text_to_string(self.image_name.unwrap(), &mut full_string_image_name));
            } else {
                image_name_option = None;
            }


            let result = query!(
                "UPDATE contacts SET contact_name = COALESCE($1, contact_name), link_name = COALESCE($2, link_name), image_name = COALESCE($3, image_name) WHERE id=$4",
                contact_name_option, link_name_option, image_name_option, self.id 
            ).execute(database).await?;

            return Ok(result);
        }

        else if self.change_type == DatabaseChangeTypes::DELETE {
            let result = query!(
                "DELETE FROM contacts WHERE id=$1", self.id
            ).execute(database).await?;

            return Ok(result);
        }

        Err(Error::msg("INVALID QUERY CONTENTS"))
    }
}