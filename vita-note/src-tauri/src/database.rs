use serde::{Deserialize, Serialize};
use rusqlite::{Connection, params};
use std::fs;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: String,
    pub username: String,
    pub email: String,
    pub phone: Option<String>,
    pub password_hash: String,
    pub created_at: String,
    pub birthday: Option<String>,
    pub gender: i32,
    pub height: f64,
    pub diabetes_type: i32,
    pub diagnosis_date: Option<String>,
    pub treatment_plan: i32,
    pub target_weight: Option<f64>,
    pub target_hb_a1c: Option<f64>,
    pub target_calories: Option<f64>,
    pub target_carbohydrates: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FoodEntry {
    pub id: String,
    pub user_id: String,
    pub created_at: String,
    pub meal_type: i32,
    pub meal_time: String,
    pub food_name: String,
    pub quantity: f64,
    pub calories: f64,
    pub carbohydrates: f64,
    pub protein: f64,
    pub fat: f64,
    pub gi: Option<f64>,
    pub gl: Option<f64>,
    pub source: i32,
    pub image_path: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BloodGlucose {
    pub id: String,
    pub user_id: String,
    pub created_at: String,
    pub value: f64,
    pub measurement_time: i32,
    pub measurement_time_exact: Option<String>,
    pub before_meal_glucose: Option<f64>,
    pub after_meal_glucose: Option<f64>,
    pub related_meal: Option<i32>,
    pub notes: Option<String>,
    pub device_name: Option<String>,
    pub device_serial: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Medication {
    pub id: String,
    pub user_id: String,
    pub created_at: String,
    pub drug_name: String,
    pub r#type: i32,
    pub dose: f64,
    pub unit: String,
    pub timing: i32,
    pub insulin_type: Option<i32>,
    pub insulin_duration: Option<i32>,
    pub scheduled_time: String,
    pub actual_time: Option<String>,
    pub is_taken: bool,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChatMessage {
    pub id: String,
    pub user_id: String,
    pub created_at: String,
    pub role: String,
    pub content: String,
    pub model: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiPagedResult<T> {
    pub items: Vec<T>,
    pub total: i64,
    pub page: i64,
    pub page_size: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub message: Option<String>,
}

use tauri::Manager;

fn open_conn() -> Result<Connection, String> {
    // 尝试使用 Tauri 应用目录，如果失败则使用本地数据目录
    let app_data_dir = if let Some(app_handle) = try_get_app_handle() {
        app_handle.path().app_data_dir().ok()
    } else {
        None
    };
    
    let data_dir = app_data_dir.or_else(|| {
        dirs::data_local_dir().map(|d| d.join("VitaNote"))
    }).unwrap_or_else(|| {
        std::path::PathBuf::from("./data")
    });
    
    if let Err(e) = fs::create_dir_all(&data_dir) {
        eprintln!("Failed to create data directory: {}", e);
    }
    
    let db_path = data_dir.join("vitanote.db");
    eprintln!("Database path: {:?}", db_path);
    Connection::open(&db_path).map_err(|e| e.to_string())
}

// 尝试获取全局 app handle（需要在应用启动时设置）
use std::sync::OnceLock;
static APP_HANDLE: OnceLock<tauri::AppHandle> = OnceLock::new();

pub fn set_app_handle(handle: tauri::AppHandle) {
    let _ = APP_HANDLE.set(handle);
}

fn try_get_app_handle() -> Option<&'static tauri::AppHandle> {
    APP_HANDLE.get()
}

fn create_tables(conn: &Connection) -> Result<(), String> {
    let queries = vec![
        r#"
        CREATE TABLE IF NOT EXISTS Users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL,
            birthday TEXT,
            gender INTEGER NOT NULL DEFAULT 0,
            height REAL NOT NULL DEFAULT 0,
            diabetes_type INTEGER NOT NULL DEFAULT 0,
            diagnosis_date TEXT,
            treatment_plan INTEGER NOT NULL DEFAULT 0,
            target_weight REAL,
            target_hbA1c REAL,
            target_calories REAL,
            target_carbohydrates REAL
        )
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS FoodEntries (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            meal_type INTEGER NOT NULL,
            meal_time TEXT NOT NULL,
            food_name TEXT NOT NULL,
            quantity REAL NOT NULL,
            calories REAL NOT NULL,
            carbohydrates REAL NOT NULL,
            protein REAL NOT NULL,
            fat REAL NOT NULL,
            gi REAL,
            gl REAL,
            source INTEGER NOT NULL DEFAULT 0,
            image_path TEXT,
            notes TEXT,
            FOREIGN KEY (user_id) REFERENCES Users(id)
        )
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS BloodGlucose (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            value REAL NOT NULL,
            measurement_time INTEGER NOT NULL,
            measurement_time_exact TEXT,
            before_meal_glucose REAL,
            after_meal_glucose REAL,
            related_meal INTEGER,
            notes TEXT,
            device_name TEXT,
            device_serial TEXT,
            FOREIGN KEY (user_id) REFERENCES Users(id)
        )
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS Medications (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            drug_name TEXT NOT NULL,
            type INTEGER NOT NULL,
            dose REAL NOT NULL,
            unit TEXT NOT NULL,
            timing INTEGER NOT NULL,
            insulin_type INTEGER,
            insulin_duration INTEGER,
            scheduled_time TEXT NOT NULL,
            actual_time TEXT,
            is_taken INTEGER NOT NULL DEFAULT 0,
            notes TEXT,
            FOREIGN KEY (user_id) REFERENCES Users(id)
        )
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS ChatMessages (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            model TEXT,
            FOREIGN KEY (user_id) REFERENCES Users(id)
        )
        "#,
    ];

    for query in queries {
        conn.execute(query, params![]).map_err(|e| e.to_string())?;
    }

    Ok(())
}

// ============ Database Initialization ============

#[tauri::command]
pub async fn db_init() -> Result<ApiResponse<String>, String> {
    let conn = open_conn()?;
    create_tables(&conn)?;
    
    Ok(ApiResponse {
        success: true,
        data: Some("Database initialized successfully".to_string()),
        message: None,
    })
}

// ============ User Commands ============

#[tauri::command]
pub async fn user_create(user: User) -> Result<ApiResponse<User>, String> {
    let conn = open_conn()?;
    
    conn.execute(
        r#"INSERT INTO Users (id, username, email, phone, password_hash, created_at, 
            birthday, gender, height, diabetes_type, diagnosis_date, treatment_plan,
            target_weight, target_hbA1c, target_calories, target_carbohydrates)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)"#,
        params![
            user.id, user.username, user.email, user.phone, user.password_hash,
            user.created_at, user.birthday, user.gender, user.height, user.diabetes_type,
            user.diagnosis_date, user.treatment_plan, user.target_weight, user.target_hb_a1c,
            user.target_calories, user.target_carbohydrates
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(ApiResponse {
        success: true,
        data: Some(user),
        message: None,
    })
}

#[tauri::command]
pub async fn user_get_by_email(email: String) -> Result<ApiResponse<Option<User>>, String> {
    let conn = open_conn()?;
    
    let user = conn.query_row(
        "SELECT * FROM Users WHERE email = ?1",
        params![email],
        |row| {
            Ok(User {
                id: row.get(0)?,
                username: row.get(1)?,
                email: row.get(2)?,
                phone: row.get(3)?,
                password_hash: row.get(4)?,
                created_at: row.get(5)?,
                birthday: row.get(6)?,
                gender: row.get(7)?,
                height: row.get(8)?,
                diabetes_type: row.get(9)?,
                diagnosis_date: row.get(10)?,
                treatment_plan: row.get(11)?,
                target_weight: row.get(12)?,
                target_hb_a1c: row.get(13)?,
                target_calories: row.get(14)?,
                target_carbohydrates: row.get(15)?,
            })
        },
    )
    .ok();

    Ok(ApiResponse {
        success: true,
        data: Some(user),
        message: None,
    })
}

#[tauri::command]
pub async fn user_update(user: User) -> Result<ApiResponse<User>, String> {
    let conn = open_conn()?;
    
    conn.execute(
        r#"UPDATE Users SET 
            username = ?2, email = ?3, phone = ?4, birthday = ?5, 
            gender = ?6, height = ?7, diabetes_type = ?8, diagnosis_date = ?9, 
            treatment_plan = ?10, target_weight = ?11, target_hbA1c = ?12, 
            target_calories = ?13, target_carbohydrates = ?14
        WHERE id = ?1"#,
        params![
            user.id, user.username, user.email, user.phone, user.birthday,
            user.gender, user.height, user.diabetes_type, user.diagnosis_date,
            user.treatment_plan, user.target_weight, user.target_hb_a1c,
            user.target_calories, user.target_carbohydrates
        ],
    )
    .map_err(|e: rusqlite::Error| e.to_string())?;

    Ok(ApiResponse {
        success: true,
        data: Some(user),
        message: None,
    })
}

#[tauri::command]
pub async fn user_get_by_id(id: String) -> Result<ApiResponse<Option<User>>, String> {
    let conn = open_conn()?;

    let user = conn.query_row(
        "SELECT * FROM Users WHERE id = ?1",
        params![id],
        |row: &rusqlite::Row<'_>| {
            Ok(User {
                id: row.get(0)?,
                username: row.get(1)?,
                email: row.get(2)?,
                phone: row.get(3)?,
                password_hash: row.get(4)?,
                created_at: row.get(5)?,
                birthday: row.get(6)?,
                gender: row.get(7)?,
                height: row.get(8)?,
                diabetes_type: row.get(9)?,
                diagnosis_date: row.get(10)?,
                treatment_plan: row.get(11)?,
                target_weight: row.get(12)?,
                target_hb_a1c: row.get(13)?,
                target_calories: row.get(14)?,
                target_carbohydrates: row.get(15)?,
            })
        },
    )
    .ok();

    Ok(ApiResponse {
        success: true,
        data: Some(user),
        message: None,
    })
}

// ============ Food Entry Commands ============

#[tauri::command]
pub async fn food_entry_create(entry: FoodEntry) -> Result<ApiResponse<FoodEntry>, String> {
    let conn = open_conn()?;
    
    conn.execute(
        r#"INSERT INTO FoodEntries (id, user_id, created_at, meal_type, meal_time, food_name,
            quantity, calories, carbohydrates, protein, fat, gi, gl, source, image_path, notes)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)"#,
        params![
            entry.id, entry.user_id, entry.created_at, entry.meal_type, entry.meal_time,
            entry.food_name, entry.quantity, entry.calories, entry.carbohydrates, entry.protein,
            entry.fat, entry.gi, entry.gl, entry.source, entry.image_path, entry.notes
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(ApiResponse {
        success: true,
        data: Some(entry),
        message: None,
    })
}

#[tauri::command]
pub async fn food_entry_get_by_user(
    user_id: String,
    start_date: String,
    end_date: String,
    page: i64,
    page_size: i64,
) -> Result<ApiResponse<ApiPagedResult<FoodEntry>>, String> {
    let conn = open_conn()?;
    
    let offset = (page - 1) * page_size;
    
    let mut stmt = conn.prepare(
        r#"SELECT * FROM FoodEntries 
        WHERE user_id = ?1 AND created_at >= ?2 AND created_at < ?3
        ORDER BY created_at DESC
        LIMIT ?4 OFFSET ?5"#,
    )
    .map_err(|e: rusqlite::Error| e.to_string())?;

    let items: Vec<FoodEntry> = stmt
        .query_map(
            params![user_id, start_date, end_date, page_size, offset],
            |row: &rusqlite::Row<'_>| {
                Ok(FoodEntry {
                    id: row.get(0)?,
                    user_id: row.get(1)?,
                    created_at: row.get(2)?,
                    meal_type: row.get(3)?,
                    meal_time: row.get(4)?,
                    food_name: row.get(5)?,
                    quantity: row.get(6)?,
                    calories: row.get(7)?,
                    carbohydrates: row.get(8)?,
                    protein: row.get(9)?,
                    fat: row.get(10)?,
                    gi: row.get(11)?,
                    gl: row.get(12)?,
                    source: row.get(13)?,
                    image_path: row.get(14)?,
                    notes: row.get(15)?,
                })
            },
        )
        .map_err(|e: rusqlite::Error| e.to_string())?
        .filter_map(|r: Result<FoodEntry, rusqlite::Error>| r.ok())
        .collect();

    let total: i64 = conn
        .query_row(
            r#"SELECT COUNT(*) FROM FoodEntries 
            WHERE user_id = ?1 AND created_at >= ?2 AND created_at < ?3"#,
            params![user_id, start_date, end_date],
            |row: &rusqlite::Row<'_>| row.get(0),
        )
        .unwrap_or(0);

    Ok(ApiResponse {
        success: true,
        data: Some(ApiPagedResult {
            items,
            total,
            page,
            page_size,
        }),
        message: None,
    })
}

#[tauri::command]
pub async fn food_entry_delete(id: String) -> Result<ApiResponse<String>, String> {
    let conn = open_conn()?;
    
    conn.execute("DELETE FROM FoodEntries WHERE id = ?1", params![id])
        .map_err(|e: rusqlite::Error| e.to_string())?;

    Ok(ApiResponse {
        success: true,
        data: Some("Deleted".to_string()),
        message: None,
    })
}

// ============ Blood Glucose Commands ============

#[tauri::command]
pub async fn blood_glucose_create(entry: BloodGlucose) -> Result<ApiResponse<BloodGlucose>, String> {
    let conn = open_conn()?;
    
    conn.execute(
        r#"INSERT INTO BloodGlucose (id, user_id, created_at, value, measurement_time,
            measurement_time_exact, before_meal_glucose, after_meal_glucose, related_meal,
            notes, device_name, device_serial)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)"#,
        params![
            entry.id, entry.user_id, entry.created_at, entry.value, entry.measurement_time,
            entry.measurement_time_exact, entry.before_meal_glucose, entry.after_meal_glucose,
            entry.related_meal, entry.notes, entry.device_name, entry.device_serial
        ],
    )
    .map_err(|e: rusqlite::Error| e.to_string())?;

    Ok(ApiResponse {
        success: true,
        data: Some(entry),
        message: None,
    })
}

#[tauri::command]
pub async fn blood_glucose_get_by_user(
    user_id: String,
    start_date: String,
    end_date: String,
    page: i64,
    page_size: i64,
) -> Result<ApiResponse<ApiPagedResult<BloodGlucose>>, String> {
    let conn = open_conn()?;
    
    let offset = (page - 1) * page_size;
    
    let mut stmt = conn.prepare(
        r#"SELECT * FROM BloodGlucose 
        WHERE user_id = ?1 AND created_at >= ?2 AND created_at < ?3
        ORDER BY created_at DESC
        LIMIT ?4 OFFSET ?5"#,
    )
    .map_err(|e: rusqlite::Error| e.to_string())?;

    let items: Vec<BloodGlucose> = stmt
        .query_map(
            params![user_id, start_date, end_date, page_size, offset],
            |row: &rusqlite::Row<'_>| {
                Ok(BloodGlucose {
                    id: row.get(0)?,
                    user_id: row.get(1)?,
                    created_at: row.get(2)?,
                    value: row.get(3)?,
                    measurement_time: row.get(4)?,
                    measurement_time_exact: row.get(5)?,
                    before_meal_glucose: row.get(6)?,
                    after_meal_glucose: row.get(7)?,
                    related_meal: row.get(8)?,
                    notes: row.get(9)?,
                    device_name: row.get(10)?,
                    device_serial: row.get(11)?,
                })
            },
        )
        .map_err(|e: rusqlite::Error| e.to_string())?
        .filter_map(|r: Result<BloodGlucose, rusqlite::Error>| r.ok())
        .collect();

    let total: i64 = conn
        .query_row(
            r#"SELECT COUNT(*) FROM BloodGlucose 
            WHERE user_id = ?1 AND created_at >= ?2 AND created_at < ?3"#,
            params![user_id, start_date, end_date],
            |row: &rusqlite::Row<'_>| row.get(0),
        )
        .unwrap_or(0);

    Ok(ApiResponse {
        success: true,
        data: Some(ApiPagedResult {
            items,
            total,
            page,
            page_size,
        }),
        message: None,
    })
}

#[tauri::command]
pub async fn blood_glucose_delete(id: String) -> Result<ApiResponse<String>, String> {
    let conn = open_conn()?;
    
    conn.execute("DELETE FROM BloodGlucose WHERE id = ?1", params![id])
        .map_err(|e: rusqlite::Error| e.to_string())?;

    Ok(ApiResponse {
        success: true,
        data: Some("Deleted".to_string()),
        message: None,
    })
}

// ============ Medication Commands ============

#[tauri::command]
pub async fn medication_create(entry: Medication) -> Result<ApiResponse<Medication>, String> {
    let conn = open_conn()?;
    
    conn.execute(
        r#"INSERT INTO Medications (id, user_id, created_at, drug_name, type, dose, unit,
            timing, insulin_type, insulin_duration, scheduled_time, actual_time, is_taken, notes)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)"#,
        params![
            entry.id, entry.user_id, entry.created_at, entry.drug_name, entry.r#type, entry.dose,
            entry.unit, entry.timing, entry.insulin_type, entry.insulin_duration,
            entry.scheduled_time, entry.actual_time, if entry.is_taken { 1i32 } else { 0i32 }, entry.notes
        ],
    )
    .map_err(|e: rusqlite::Error| e.to_string())?;

    Ok(ApiResponse {
        success: true,
        data: Some(entry),
        message: None,
    })
}

#[tauri::command]
pub async fn medication_get_by_user(
    user_id: String,
    start_date: String,
    end_date: String,
    page: i64,
    page_size: i64,
) -> Result<ApiResponse<ApiPagedResult<Medication>>, String> {
    let conn = open_conn()?;
    
    let offset = (page - 1) * page_size;
    
    let mut stmt = conn.prepare(
        r#"SELECT * FROM Medications 
        WHERE user_id = ?1 AND created_at >= ?2 AND created_at < ?3
        ORDER BY created_at DESC
        LIMIT ?4 OFFSET ?5"#,
    )
    .map_err(|e: rusqlite::Error| e.to_string())?;

    let items: Vec<Medication> = stmt
        .query_map(
            params![user_id, start_date, end_date, page_size, offset],
            |row: &rusqlite::Row<'_>| {
                Ok(Medication {
                    id: row.get(0)?,
                    user_id: row.get(1)?,
                    created_at: row.get(2)?,
                    drug_name: row.get(3)?,
                    r#type: row.get(4)?,
                    dose: row.get(5)?,
                    unit: row.get(6)?,
                    timing: row.get(7)?,
                    insulin_type: row.get(8)?,
                    insulin_duration: row.get(9)?,
                    scheduled_time: row.get(10)?,
                    actual_time: row.get(11)?,
                    is_taken: row.get::<_, i32>(12)? == 1,
                    notes: row.get(13)?,
                })
            },
        )
        .map_err(|e: rusqlite::Error| e.to_string())?
        .filter_map(|r: Result<Medication, rusqlite::Error>| r.ok())
        .collect();

    let total: i64 = conn
        .query_row(
            r#"SELECT COUNT(*) FROM Medications 
            WHERE user_id = ?1 AND created_at >= ?2 AND created_at < ?3"#,
            params![user_id, start_date, end_date],
            |row: &rusqlite::Row<'_>| row.get(0),
        )
        .unwrap_or(0);

    Ok(ApiResponse {
        success: true,
        data: Some(ApiPagedResult {
            items,
            total,
            page,
            page_size,
        }),
        message: None,
    })
}

#[tauri::command]
pub async fn medication_mark_taken(id: String, actual_time: String) -> Result<ApiResponse<String>, String> {
    let conn = open_conn()?;
    
    conn.execute(
        "UPDATE Medications SET is_taken = 1, actual_time = ?2 WHERE id = ?1",
        params![id, actual_time],
    )
    .map_err(|e: rusqlite::Error| e.to_string())?;

    Ok(ApiResponse {
        success: true,
        data: Some("Marked as taken".to_string()),
        message: None,
    })
}

#[tauri::command]
pub async fn medication_delete(id: String) -> Result<ApiResponse<String>, String> {
    let conn = open_conn()?;
    
    conn.execute("DELETE FROM Medications WHERE id = ?1", params![id])
        .map_err(|e: rusqlite::Error| e.to_string())?;

    Ok(ApiResponse {
        success: true,
        data: Some("Deleted".to_string()),
        message: None,
    })
}

// ============ Chat Message Commands ============

#[tauri::command]
pub async fn chat_message_create(message: ChatMessage) -> Result<ApiResponse<String>, String> {
    let conn = open_conn()?;
    
    conn.execute(
        r#"INSERT INTO ChatMessages (id, user_id, created_at, role, content, model)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)"#,
        params![
            message.id, message.user_id, message.created_at, message.role, message.content, message.model
        ],
    )
    .map_err(|e: rusqlite::Error| e.to_string())?;

    Ok(ApiResponse {
        success: true,
        data: Some("Created".to_string()),
        message: None,
    })
}

#[tauri::command]
pub async fn chat_message_get_history(
    user_id: String,
    take: i64,
) -> Result<ApiResponse<Vec<ChatMessage>>, String> {
    let conn = open_conn()?;
    
    let mut stmt = conn.prepare(
        r#"SELECT * FROM ChatMessages 
        WHERE user_id = ?1 
        ORDER BY created_at DESC
        LIMIT ?2"#,
    )
    .map_err(|e: rusqlite::Error| e.to_string())?;

    let messages: Vec<ChatMessage> = stmt
        .query_map(
            params![user_id, take],
            |row: &rusqlite::Row<'_>| {
                Ok(ChatMessage {
                    id: row.get(0)?,
                    user_id: row.get(1)?,
                    created_at: row.get(2)?,
                    role: row.get(3)?,
                    content: row.get(4)?,
                    model: row.get(5)?,
                })
            },
        )
        .map_err(|e: rusqlite::Error| e.to_string())?
        .filter_map(|r: Result<ChatMessage, rusqlite::Error>| r.ok())
        .collect();

    Ok(ApiResponse {
        success: true,
        data: Some(messages),
        message: None,
    })
}
