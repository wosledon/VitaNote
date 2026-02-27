mod database;

use database::{
    db_init, 
    user_create, user_get_by_email, user_get_by_id, user_update,
    food_entry_create, food_entry_get_by_user, food_entry_delete,
    blood_glucose_create, blood_glucose_get_by_user, blood_glucose_delete,
    medication_create, medication_get_by_user, medication_mark_taken, medication_delete,
    chat_message_create, chat_message_get_history,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            db_init,
            user_create, user_get_by_email, user_get_by_id, user_update,
            food_entry_create, food_entry_get_by_user, food_entry_delete,
            blood_glucose_create, blood_glucose_get_by_user, blood_glucose_delete,
            medication_create, medication_get_by_user, medication_mark_taken, medication_delete,
            chat_message_create, chat_message_get_history
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
