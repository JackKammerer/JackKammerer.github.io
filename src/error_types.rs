use std::{
    fmt::{Display, Formatter},
    error::Error,
};

use axum::{
    response::{ IntoResponse, Response, Redirect },
    http::StatusCode,
};

#[derive(Debug)]
pub struct RouteError(anyhow::Error);


impl Display for RouteError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "Error with current routing function!")
    }
}

impl IntoResponse for RouteError {
    fn into_response(self) -> Response {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("There was an internal server error: {}", self.0),
        ).into_response()
    } 
}

impl<E> From<E> for RouteError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        Self(err.into())
    }
}


#[derive(Debug)]
pub struct MiddlewareError(anyhow::Error);


impl Display for MiddlewareError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "Error with middleware routing function!")
    }
}

impl IntoResponse for MiddlewareError {
    fn into_response(self) -> Response {
        Redirect::to("/private/login").into_response()
    } 
}

impl<E> From<E> for MiddlewareError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        Self(err.into())
    }
}


#[derive(Debug)]
pub struct RouteErrorText {
    info_string: String
}

impl RouteErrorText {
    pub fn new(msg: &str) -> RouteErrorText {
        RouteErrorText {info_string: msg.to_string()}
    }
}

impl Error for RouteErrorText {
    fn description(&self) -> &str {
        &self.info_string
    }
}

impl Display for RouteErrorText {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "Error with current routing function: {}", self.info_string)
    }
}


#[derive(Debug)]
pub struct JweError {
    info_string: String
}

impl JweError {
    pub fn new(msg: &str) -> JweError {
        JweError {info_string: msg.to_string()}
    }
}

impl Error for JweError {
    fn description(&self) -> &str {
        &self.info_string
    }
}

impl Display for JweError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "Error with generating JWE token: {}", self.info_string)
    }
}