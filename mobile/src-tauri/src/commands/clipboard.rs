use tauri::{Manager, AppHandle};
use tauri_plugin_clipboard::ClipboardExt;

pub fn copy_text(app: &AppHandle, text: &str) -> Result<(), String> {
    app.clipboard()
        .write_text(text.to_string())
        .map_err(|e| format!("Failed to copy text: {}", e))
}
