use tauri::{command, AppHandle};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct HealthRecordResponse {
    pub id: String,
    pub created_at: String,
}

#[derive(Serialize, Deserialize)]
pub struct WeightRecordRequest {
    pub weight: f64,
    pub body_fat_percentage: Option<String>,
    pub muscle_mass: Option<String>,
    pub water_percentage: Option<String>,
    pub comment: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct GlucoseRecordRequest {
    pub glucose_level: f64,
    pub r#type: i32,
    pub meal_type: Option<String>,
    pub comment: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct BloodPressureRecordRequest {
    pub systolic: i32,
    pub diastolic: i32,
    pub heart_rate: i32,
    pub position: Option<String>,
    pub comment: Option<String>,
}

#[command]
pub async fn add_weight_record(
    app: AppHandle,
    request: WeightRecordRequest,
) -> Result<String, String> {
    let api_url = "http://localhost:5000";
    
    let client = reqwest::Client::new();
    
    let response = client
        .post(format!("{}/api/health-records/weight", api_url))
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Failed to add weight record: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    
    Ok(response)
}

#[command]
pub async fn add_glucose_record(
    app: AppHandle,
    request: GlucoseRecordRequest,
) -> Result<String, String> {
    let api_url = "http://localhost:5000";
    
    let client = reqwest::Client::new();
    
    let response = client
        .post(format!("{}/api/health-records/glucose", api_url))
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Failed to add glucose record: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    
    Ok(response)
}

#[command]
pub async fn add_blood_pressure_record(
    app: AppHandle,
    request: BloodPressureRecordRequest,
) -> Result<String, String> {
    let api_url = "http://localhost:5000";
    
    let client = reqwest::Client::new();
    
    let response = client
        .post(format!("{}/api/health-records/blood-pressure", api_url))
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Failed to add blood pressure record: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    
    Ok(response)
}
