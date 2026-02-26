#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_camera::init())
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_filesystem::init())
        .plugin(tauri_plugin_global_shortcut::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_path::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Setup logic
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::camera::capture_image,
            commands::camera::upload_image,
            commands::camera::ocr_from_image,
            commands::camera::request_camera_permission,
            commands::clipboard::copy_text,
            commands::filesystem::save_file,
            commands::filesystem::open_file,
            commands::storage::get_file,
            commands::storage::save_file_data,
            commands::llm::chat,
            commands::llm::get_health_data,
            commands::auth::login,
            commands::auth::register,
            commands::auth::get_current_user,
            commands::health_records::add_weight_record,
            commands::health_records::add_glucose_record,
            commands::health_records::add_blood_pressure_record,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
