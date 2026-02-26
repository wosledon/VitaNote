use tauri::{
    command,
    Manager,
    AppHandle,
    Runtime,
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Serialize, Deserialize)]
pub struct ChatRequest {
    pub message: String,
    pub health_record_id: Option<String>,
    pub include_history: bool,
}

#[derive(Serialize, Deserialize)]
pub struct ChatResponse {
    pub response: String,
    pub suggestions: Vec<Suggestion>,
}

#[derive(Serialize, Deserialize)]
pub struct Suggestion {
    pub r#type: String,
    pub title: String,
    pub description: String,
}

#[command]
pub async fn chat(app: AppHandle, request: ChatRequest) -> Result<ChatResponse, String> {
    let api_url = "http://localhost:5000";
    
    let client = reqwest::Client::new();
    
    let response = client
        .post(format!("{}/api/llm/chat", api_url))
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Chat request failed: {}", e))?
        .json::<ChatResponse>()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    
    Ok(response)
}

#[command]
pub async fn get_health_data(app: AppHandle, days: i64) -> Result<std::collections::HashMap<String, String>, String> {
    let api_url = "http://localhost:5000";
    
    let client = reqwest::Client::new();
    
    let response = client
        .get(format!("{}/api/llm/health-data?days={}", api_url, days))
        .send()
        .await
        .map_err(|e| format!("Failed to fetch health data: {}", e))?
        .json::<std::collections::HashMap<String, String>>()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    
    Ok(response)
}
