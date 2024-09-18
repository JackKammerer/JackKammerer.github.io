use std::{
    net::SocketAddr, sync::{Arc, RwLock}, time::Duration 
};


use axum:: {
    error_handling::HandleErrorLayer,
    middleware, 
    routing::{
        get, 
        post, 
    }, 
    Router 
};

use tokio::net::TcpListener;

use tower_http::{
    add_extension::AddExtensionLayer, 
    services::{ ServeDir, ServeFile }, 
    compression::CompressionLayer, 
    trace::TraceLayer
};

use base64_url;
use tower::{timeout::TimeoutLayer, ServiceBuilder };
use sqlx::postgres::PgPoolOptions;
use dotenv::dotenv;

mod structs;
use structs::*;

mod randstrings;
use randstrings::*;

mod rsa_functions;
use rsa_functions::generate_rsa_keys;

mod jwe;
mod error_types;
mod template_structs;

mod routes;
use routes::*;

type SharedState = Arc<RwLock<ApplicationState>>;



fn init_router(state: SharedState) -> Router {
    Router::new()
    .route("/", get(show_home_page))
    .nest_service("/dist", ServeDir::new("dist")
    .not_found_service(ServeFile::new("dist/404.html")))
    .nest_service("/models", ServeDir::new("models")
    .not_found_service(ServeFile::new("dist/404.html")))
    .nest_service("/images", ServeDir::new("images")
    .not_found_service(ServeFile::new("dist/404.html")))
    .route("/getjwe", post(get_jwe))
    .route("/github-content", get(get_github_content_http))
    .route("/private/admin", get(server_admin_page))
    .route("/private/update-content", post(update_content))
    .route("/private/login", get(render_login_page))
    .route_layer(middleware::from_fn_with_state(state.clone(), authenticate_request))
    .fallback_service(ServeFile::new("dist/404.html"))
    .with_state(state.clone())
    .layer(ServiceBuilder::new()
        .layer(HandleErrorLayer::new(handle_error))
        .layer(TimeoutLayer::new(Duration::from_secs(10)))
        .layer(AddExtensionLayer::new(state))
        .layer(CompressionLayer::new())
        .layer(TraceLayer::new_for_http())
        .into_inner()
    ) 
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    tracing_subscriber::fmt::init();

    let database_url = std::env::var("SERVER_URL").expect("The DATABASE_URL value must be set");
    let pool = match PgPoolOptions::new()
        .max_connections(20)
        .connect(&database_url)
        .await
    {
        Ok(pool) => {
            println!("Connected to pool");
            pool
        }
        Err(err) => {
            println!("SQL Error: {}", err.to_string());
            std::process::exit(1);
        }
    };

    let key_results = generate_rsa_keys();

    let (pubkey, privkey) = match key_results {
        Ok(result) => result,
        Err(e) => {
            println!("Could not generate valid RSA keys!!");
            println!("{}", e);
            return;
        }
    };

    let mac_key = base64_url::encode(&generate_hmac_256());

    let state = 
        ApplicationState{ 
            issuer: String::from("jackkammerer.com"), 
            rsa_private_key: privkey, 
            rsa_public_key: pubkey, 
            session_time: 3600,
            mac_key: mac_key,
            db: pool
        };

    let app_state = Arc::new(RwLock::new(state));

    let result = register(app_state.clone(), LoginPacket{username: std::env::var("ADMIN_ACCOUNT_USERNAME").expect("Need Admin Username!!") , password: std::env::var("ADMIN_ACCOUNT_PASSWORD").expect("Need Admin Password!!")}).await; 

    if result {
        let router: Router = init_router(app_state);

        let addr = SocketAddr::from(([0, 0, 0, 0], 3000));

        let listener: TcpListener = TcpListener::bind(&addr).await.unwrap();
        axum::serve(listener, router.into_make_service()).await.unwrap();
    } 
}