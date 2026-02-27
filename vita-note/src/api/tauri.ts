import { invoke } from '@tauri-apps/api/core';

// ============ Types ============

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  password_hash: string;
  created_at: string;
  birthday?: string;
  gender: number;
  height: number;
  diabetes_type: number;
  diagnosis_date?: string;
  treatment_plan: number;
  target_weight?: number;
  target_hb_a1c?: number;
  target_calories?: number;
  target_carbohydrates?: number;
}

export interface FoodEntry {
  id: string;
  user_id: string;
  created_at: string;
  meal_type: number;
  meal_time: string;
  food_name: string;
  quantity: number;
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  gi?: number;
  gl?: number;
  source: number;
  image_path?: string;
  notes?: string;
}

export interface BloodGlucose {
  id: string;
  user_id: string;
  created_at: string;
  value: number;
  measurement_time: number;
  measurement_time_exact?: string;
  before_meal_glucose?: number;
  after_meal_glucose?: number;
  related_meal?: number;
  notes?: string;
  device_name?: string;
  device_serial?: string;
}

export interface Medication {
  id: string;
  user_id: string;
  created_at: string;
  drug_name: string;
  type: number;
  dose: number;
  unit: string;
  timing: number;
  insulin_type?: number;
  insulin_duration?: number;
  scheduled_time: string;
  actual_time?: string;
  is_taken: boolean;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  created_at: string;
  role: string;
  content: string;
  model?: string;
}

export interface ApiPagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// ============ Database ============

export async function dbInit(): Promise<ApiResponse<string>> {
  return invoke<ApiResponse<string>>('db_init');
}

// ============ User ============

export async function userCreate(user: Partial<User>): Promise<ApiResponse<User>> {
  return invoke<ApiResponse<User>>('user_create', { user });
}

export async function userGetByEmail(email: string): Promise<ApiResponse<User | null>> {
  return invoke<ApiResponse<User | null>>('user_get_by_email', { email });
}

export async function userGetById(id: string): Promise<ApiResponse<User | null>> {
  return invoke<ApiResponse<User | null>>('user_get_by_id', { id });
}

export async function userUpdate(user: User): Promise<ApiResponse<User>> {
  return invoke<ApiResponse<User>>('user_update', { user });
}

// ============ Food Entry ============

export async function foodEntryCreate(entry: Partial<FoodEntry>): Promise<ApiResponse<FoodEntry>> {
  return invoke<ApiResponse<FoodEntry>>('food_entry_create', { entry });
}

export async function foodEntryGetByUser(
  userId: string,
  startDate: string,
  endDate: string,
  page: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<ApiPagedResult<FoodEntry>>> {
  return invoke<ApiResponse<ApiPagedResult<FoodEntry>>>('food_entry_get_by_user', {
    userId,
    startDate,
    endDate,
    page,
    pageSize
  });
}

export async function foodEntryDelete(id: string): Promise<ApiResponse<string>> {
  return invoke<ApiResponse<string>>('food_entry_delete', { id });
}

// ============ Blood Glucose ============

export async function bloodGlucoseCreate(entry: Partial<BloodGlucose>): Promise<ApiResponse<BloodGlucose>> {
  return invoke<ApiResponse<BloodGlucose>>('blood_glucose_create', { entry });
}

export async function bloodGlucoseGetByUser(
  userId: string,
  startDate: string,
  endDate: string,
  page: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<ApiPagedResult<BloodGlucose>>> {
  return invoke<ApiResponse<ApiPagedResult<BloodGlucose>>>('blood_glucose_get_by_user', {
    userId,
    startDate,
    endDate,
    page,
    pageSize
  });
}

export async function bloodGlucoseDelete(id: string): Promise<ApiResponse<string>> {
  return invoke<ApiResponse<string>>('blood_glucose_delete', { id });
}

// ============ Medication ============

export async function medicationCreate(entry: Partial<Medication>): Promise<ApiResponse<Medication>> {
  return invoke<ApiResponse<Medication>>('medication_create', { entry });
}

export async function medicationGetByUser(
  userId: string,
  startDate: string,
  endDate: string,
  page: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<ApiPagedResult<Medication>>> {
  return invoke<ApiResponse<ApiPagedResult<Medication>>>('medication_get_by_user', {
    userId,
    startDate,
    endDate,
    page,
    pageSize
  });
}

export async function medicationMarkTaken(id: string, actualTime: string): Promise<ApiResponse<string>> {
  return invoke<ApiResponse<string>>('medication_mark_taken', { id, actualTime });
}

export async function medicationDelete(id: string): Promise<ApiResponse<string>> {
  return invoke<ApiResponse<string>>('medication_delete', { id });
}

// ============ Chat Message ============

export async function chatMessageCreate(message: Partial<ChatMessage>): Promise<ApiResponse<string>> {
  return invoke<ApiResponse<string>>('chat_message_create', { message });
}

export async function chatMessageGetHistory(
  userId: string,
  take: number = 50
): Promise<ApiResponse<ChatMessage[]>> {
  return invoke<ApiResponse<ChatMessage[]>>('chat_message_get_history', { userId, take });
}
