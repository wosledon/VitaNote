import { v4 as uuidv4 } from 'uuid';

export type MealType = 0 | 1 | 2 | 3; // Breakfast, Lunch, Dinner, Snack
export type Gender = 0 | 1 | 2; // Unknown, Male, Female
export type DiabetesType = 0 | 1 | 2 | 3; // Unknown, Type1, Type2, Gestational
export type TreatmentPlan = 0 | 1 | 2 | 3; // DietOnly, OralMedication, Insulin, Combined
export type EntrySource = 0 | 1 | 2 | 3; // Manual, FoodDatabase, AIRecognition, BarcodeScan
export type MeasurementTimeType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type MedicationType = 0 | 1 | 2;
export type MedicationTiming = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type InsulinType = 0 | 1 | 2 | 3 | 4;

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  createdAt: string;
  birthday?: string;
  gender: Gender;
  height: number;
  diabetesType: DiabetesType;
  diagnosisDate?: string;
  treatmentPlan: TreatmentPlan;
  targetWeight?: number;
  targetHbA1c?: number;
  targetCalories?: number;
  targetCarbohydrates?: number;
}

export interface FoodEntry {
  id: string;
  userId: string;
  createdAt: string;
  mealType: MealType;
  mealTime: string;
  foodName: string;
  quantity: number;
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  gi?: number;
  gl?: number;
  source: EntrySource;
  imagePath?: string;
  notes?: string;
}

export interface BloodGlucose {
  id: string;
  userId: string;
  createdAt: string;
  value: number;
  measurementTime: MeasurementTimeType;
  measurementTimeExact?: string;
  beforeMealGlucose?: number;
  afterMealGlucose?: number;
  relatedMeal?: number;
  notes?: string;
  deviceName?: string;
  deviceSerial?: string;
}

export interface Medication {
  id: string;
  userId: string;
  createdAt: string;
  drugName: string;
  type: MedicationType;
  dose: number;
  unit: string;
  timing: MedicationTiming;
  insulinType?: InsulinType;
  insulinDuration?: number;
  scheduledTime: string;
  actualTime?: string;
  isTaken: boolean;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  createdAt: string;
  role: 'user' | 'assistant';
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
  timestamp: string;
}
