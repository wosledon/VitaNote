import apiClient from './client'
import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  WeightRecordRequest,
  GlucoseRecordRequest,
  BloodPressureRecordRequest,
  ChatRequest,
  ChatResponse,
  OcrRequest,
  OcrResponse,
  WeightRecordResponse,
  GlucoseRecordResponse,
  BloodPressureRecordResponse,
  FoodRecordRequest,
  FoodRecordResponse,
  FoodStatisticsResponse,
  OCRRequest,
  OCRResponse,
  HealthStatisticsResponse,
  TrendAnalysisResponse,
} from '../types/api'

export const authService = {
  register: (request: RegisterRequest) => apiClient.post<AuthResponse>('/auth/register', request),
  login: (request: LoginRequest) => apiClient.post<AuthResponse>('/auth/login', request),
  logout: () => apiClient.post('/auth/logout'),
}

export const healthRecordService = {
  getWeightRecords: (startDate?: Date, endDate?: Date) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate.toISOString())
    if (endDate) params.append('endDate', endDate.toISOString())
    return apiClient.get<WeightRecordResponse[]>(`/health-records/weight?${params.toString()}`)
  },
  
  addWeightRecord: (request: WeightRecordRequest) => 
    apiClient.post<string>('/health-records/weight', request),
  
  getGlucoseRecords: (startDate?: Date, endDate?: Date) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate.toISOString())
    if (endDate) params.append('endDate', endDate.toISOString())
    return apiClient.get<GlucoseRecordResponse[]>(`/health-records/glucose?${params.toString()}`)
  },
  
  addGlucoseRecord: (request: GlucoseRecordRequest) => 
    apiClient.post<string>('/health-records/glucose', request),
  
  getBloodPressureRecords: (startDate?: Date, endDate?: Date) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate.toISOString())
    if (endDate) params.append('endDate', endDate.toISOString())
    return apiClient.get<BloodPressureRecordResponse[]>(`/health-records/blood-pressure?${params.toString()}`)
  },
  
  addBloodPressureRecord: (request: BloodPressureRecordRequest) =>
    apiClient.post<string>('/health-records/blood-pressure', request),

  getStatistics: () => apiClient.get<HealthStatisticsResponse>('/health-records/statistics'),
  getTrendAnalysis: (days: number = 30) => apiClient.get<TrendAnalysisResponse>(`/health-records/trend-analysis?days=${days}`),
  calculateBMI: () => apiClient.get<number | null>('/health-records/bmi'),
  exportData: (format: 'json' | 'csv' = 'json') => apiClient.get<Blob>('/health-records/export', { responseType: 'blob' }),
}

export const foodRecordService = {
  getFoodRecordsByDate: (date: Date) =>
    apiClient.get<FoodRecordResponse[]>(`/food-records/date/${date.toISOString().split('T')[0]}`),

  addFoodRecord: (request: FoodRecordRequest) =>
    apiClient.post<string>('/food-records', request),

  getFoodStatistics: (date: Date) =>
    apiClient.get<FoodStatisticsResponse>(`/food-records/date/${date.toISOString().split('T')[0]}/statistics`),

  deleteFoodRecord: (id: string) =>
    apiClient.delete<boolean>(`/food-records/${id}`),

  ocrFromImage: (request: OCRRequest) =>
    apiClient.post<OCRResponse>('/food-records/ocr', request),
}

export const ocrService = {
  extractText: (request: OcrRequest) => 
    apiClient.post<OcrResponse>('/ocr/extract-text', request),
  
  detectFood: (base64Image: string) => 
    apiClient.post<string>('/ocr/detect-food', { base64Image }),
  
  detectHealthData: (base64Image: string) => 
    apiClient.post<string>('/ocr/detect-health-data', { base64Image }),
  
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<string>('/ocr/upload-image', formData)
  },
}

export const llmService = {
  chat: (request: ChatRequest) => 
    apiClient.post<ChatResponse>('/llm/chat', request),
  
  getHealthAdvice: (prompt: string) => 
    apiClient.post<string>('/llm/advice', prompt),
  
  getHealthData: (days: number = 7) => 
    apiClient.get<Record<string, string>>(`/llm/health-data?days=${days}`),
}
