use tauri::{Manager, AppHandle};
use tauri_plugin_filesystem::FsScope;

pub fn save_file(app: &AppHandle, filename: &str, content: &[u8]) -> Result<String, String> {
    let scope = app.state::<FsScope>();
    
    let path = std::path::Path::new("uploads")
        .join(filename);
    
    let full_path = std::path::Path::new("uploads")
        .join(filename);
    
    std::fs::create_dir_all("uploads").map_err(|e| format!("Failed to create directory: {}", e))?;
    std::fs::write(&full_path, content).map_err(|e| format!("Failed to save file: {}", e))?;
    
    Ok(full_path.to_string_lossy().to_string())
}

pub fn open_file(_app: &AppHandle) -> Result<String, String> {
    // TODO: Implement file picker
    Err("Not implemented".to_string())
}
