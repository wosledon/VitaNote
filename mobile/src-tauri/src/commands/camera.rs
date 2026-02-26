use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_camera::Camera;
use tauri_plugin_filesystem::FsScope;

#[derive(Serialize, Deserialize)]
pub struct ImageData {
    pub base64: String,
    pub mime_type: String,
    pub width: u32,
    pub height: u32,
}

#[tauri::command]
pub async fn capture_image(app: AppHandle) -> Result<ImageData, String> {
    let camera = app.state::<tauri_plugin_camera::Camera>();
    
    match camera.capture().await {
        Ok(image) => {
            // 将图像转换为base64
            let encoded = image.as_base64();
            
            Ok(ImageData {
                base64: encoded,
                mime_type: image.mime_type().to_string(),
                width: image.width(),
                height: image.height(),
            })
        }
        Err(e) => Err(format!("Failed to capture image: {}", e))
    }
}

#[tauri::command]
pub async fn upload_image(image_data: &str, app: AppHandle) -> Result<String, String> {
    let config = app.config();
    let api_url = config
        .app
        .settings
        .api_url
        .unwrap_or_else(|| "http://localhost:5000".to_string());
    
    let client = reqwest::Client::new();
    
    let response = client
        .post(format!("{}/api/upload/base64-image", api_url))
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "base64Image": image_data
        }))
        .send()
        .await
        .map_err(|e| format!("Failed to upload image: {}", e))?
        .json::<serde_json::Value>()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    
    Ok(response.get("url")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string())
}

#[tauri::command]
pub async fn ocr_from_image(image_data: &str) -> Result<String, String> {
    // 发送到后端OCR API
    let api_url = "http://localhost:5000";
    
    let client = reqwest::Client::new();
    
    let response = client
        .post(format!("{}/api/ocr/extract-text", api_url))
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "base64Image": image_data,
            "type": "food"
        }))
        .send()
        .await
        .map_err(|e| format!("OCR request failed: {}", e))?
        .json::<serde_json::Value>()
        .await
        .map_err(|e| format!("Failed to parse OCR response: {}", e))?;
    
    Ok(response.get("text")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string())
}

#[tauri::command]
pub async fn request_camera_permission(app: AppHandle) -> Result<bool, String> {
    let camera = app.state::<tauri_plugin_camera::Camera>();
    
    match camera.request_permission().await {
        Ok(granted) => Ok(granted),
        Err(e) => Err(format!("Failed to request camera permission: {}", e))
    }
}
