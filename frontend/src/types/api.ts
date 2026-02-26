// Auto-generated types from Swagger
// Run: npm run openapi

export interface RegisterRequest {
  userName: string
  email: string
  password: string
  phoneNumber?: string
}

export interface LoginRequest {
  userName: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  tokenExpires: string
  user: UserData
}

export interface UserData {
  id: string
  userName: string
  email: string
  phoneNumber?: string
}

export interface WeightRecordRequest {
  weight: number
  bodyFatPercentage?: string
  muscleMass?: string
  waterPercentage?: string
  comment?: string
}

export interface GlucoseRecordRequest {
  glucoseLevel: number
  type: GlucoseType
  mealType?: string
  comment?: string
}

export interface BloodPressureRecordRequest {
  systolic: number
  diastolic: number
  heartRate: number
  position?: string
  comment?: string
}

export interface HealthRecordResponse {
  id: string
  createdAt: string
}

export interface WeightRecordResponse extends HealthRecordResponse {
  weight: number
  bodyFatPercentage?: string
  muscleMass?: string
  waterPercentage?: string
  comment?: string
  recordedAt: string
}

export interface GlucoseRecordResponse extends HealthRecordResponse {
  glucoseLevel: number
  type: GlucoseType
  mealType?: string
  comment?: string
  recordedAt: string
}

export interface BloodPressureRecordResponse extends HealthRecordResponse {
  systolic: number
  diastolic: number
  heartRate: number
  position?: string
  comment?: string
  recordedAt: string
}

export enum GlucoseType {
  Fasting = 1,
  Postprandial = 2,
  Random = 3
}

export interface ChatRequest {
  message: string
  healthRecordId?: string
  includeHistory: boolean
}

export interface ChatResponse {
  response: string
  suggestions: Suggestion[]
}

export interface Suggestion {
  type: string
  title: string
  description: string
}

export interface OcrRequest {
  base64Image: string
  type: OcrType
  language?: string
}

export interface OcrResponse {
  text: string
  entities: Entity[]
}

export interface Entity {
  type: string
  value: string
  confidence: number
}

export enum OcrType {
  Food = 1,
  Health = 2,
  General = 3
}

export interface Profile {
  id: string
  createdAt: string
  userId: string
  gender?: string
  birthDate?: string
  height?: number
  activityLevel?: string
  goals?: string
}

// Food Record Types
export interface FoodRecordRequest {
  foodName: string
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  eatenAt: string
  mealType?: string
  comment?: string
  base64Image?: string
}

export interface FoodRecordResponse {
  id: string
  foodName: string
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  eatenAt: string
  mealType?: string
  comment?: string
  photoPath?: string
  createdAt: string
}

export interface FoodStatisticsResponse {
  totalRecords: number
  totalCalories: number
  totalProtein: number
  totalCarbohydrates: number
  totalFat: number
  averageCalories: number
  mealTimeStats: MealTimeStat[]
}

export interface MealTimeStat {
  mealType: string
  count: number
  calories: number
}

// Health Statistics Types
export interface HealthStatisticsResponse {
  totalWeightRecords: number
  totalGlucoseRecords: number
  totalBloodPressureRecords: number
  averageWeight?: number
  latestWeight?: number
  bmi?: number
  weightTrend?: string
  lastRecordedAt?: string
}

export interface TrendAnalysisResponse {
  weightTrend: WeightTrendData
  glucoseTrend: GlucoseTrendData
  bloodPressureTrend: BloodPressureTrendData
}

export interface WeightTrendData {
  dataPoints: ChartDataPoint[]
  startWeight?: number
  endWeight?: number
  change?: number
  changePercentage?: number
  trend?: string
}

export interface GlucoseTrendData {
  dataPoints: ChartDataPoint[]
  average?: number
  min?: number
  max?: number
}

export interface BloodPressureTrendData {
  dataPoints: ChartDataPoint[]
  averageSystolic?: number
  averageDiastolic?: number
  averageHeartRate?: number
}

export interface ChartDataPoint {
  date: string
  value: number
}
