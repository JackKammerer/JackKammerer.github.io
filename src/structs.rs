use serde::{ Deserialize, Serialize };
use uuid::Uuid;
use sqlx::{FromRow, Pool, Postgres};

#[derive(Clone)]
pub struct ApplicationState {
    pub issuer: String,
    pub rsa_public_key: String,
    pub rsa_private_key: String,
    pub session_time: u64,
    pub mac_key: String,
    pub db: Pool<Postgres>
}

#[derive(Deserialize)]
pub struct LoginPacket {
    pub username: String,
    pub password: String
}

#[derive(Deserialize, Serialize)]
pub struct JWEHeader {
    pub alg: &'static str,
    pub enc: &'static str
}

#[derive(Deserialize, Serialize)]
pub struct JWTHeader {
    pub typ: &'static str,
    pub alg: &'static str
}

#[derive(Deserialize, Serialize)]
pub struct JWTBody {
    pub iss: String,
    pub sub: String,
    pub iat: String,
    pub exp: String,
    pub xsrf: String 
}

#[derive(Debug, FromRow, Deserialize, Serialize)]
#[allow(non_snake_case)]
pub struct UserAccountSchema {
    pub id: Uuid,
    pub username: String,
    pub password: String,
    pub salt: String
}
