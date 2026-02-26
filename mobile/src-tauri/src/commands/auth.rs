use tauri::{command, AppHandle, Manager};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AuthResponse {
    pub token: String,
    pub refresh_token: String,
    pub user: UserData,
}

#[derive(Serialize, Deserialize)]
pub struct UserData {
    pub id: String,
    pub user_name: String,
    pub email: String,
    pub phone_number: Option<String>,
}

#[command]
pub async fn login(
    app: AppHandle,
    username: String,
    password: String,
) -> Result<AuthResponse, String> {
    let api_url = "http://localhost:5000";
    
    let client = reqwest::Client::new();
    
    let response = client
        .post(format!("{}/api/auth/login", api_url))
        .json(&serde_json::json!({
            "userName": username,
            "password": password
        }))
        .send()
        .await
        .map_err(|e| format!("Login request failed: {}", e))?
        .json::<AuthResponse>()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    
    // Store token
    let config = app.config();
    let _ = config;
    
    Ok(response)
}

#[command]
pub async fn register(
    app: AppHandle,
    username: String,
    email: String,
    password: String,
) -> Result<AuthResponse, String> {
    let api_url = "http://localhost:5000";
    
    let client = reqwest::Client::new();
    
    let response = client
        .post(format!("{}/api/auth/register", api_url))
        .json(&serde_json::json!({
            "userName": username,
            "email": email,
            "password": password
        }))
        .send()
        .await
        .map_err(|e| format!("Registration request failed: {}", e))?
        .json::<AuthResponse>()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    
    Ok(response)
}

#[command]
pub async fn get_current_user(app: AppHandle) -> Result<UserData, String> {
    // TODO: Implement user retrieval from storage
    Err("Not implemented".to_string())
}
