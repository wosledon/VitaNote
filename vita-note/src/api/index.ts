import apiClient from './client';
import type { ApiResponse, ApiPagedResult, User, FoodEntry, BloodGlucose, Medication, ChatMessage } from '../types';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  token: string;
  user: User;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<string>> => {
    const response = await apiClient.post<ApiResponse<string>>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  }
};

export const foodApi = {
  getEntries: (
    userId: string,
    startDate: Date,
    endDate: Date,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<ApiPagedResult<FoodEntry>>> => {
    return apiClient.get<ApiResponse<ApiPagedResult<FoodEntry>>>('/foods', {
      params: {
        userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        page,
        pageSize
      }
    }).then(res => res.data);
  },

  getTodayStatistics: (userId: string): Promise<ApiResponse<FoodStatistics>> => {
    return apiClient.get<ApiResponse<FoodStatistics>>('/foods/statistics/today', {
      params: { userId }
    }).then(res => res.data);
  },

  createEntry: (data: Partial<FoodEntry>): Promise<ApiResponse<FoodEntry>> => {
    return apiClient.post<ApiResponse<FoodEntry>>('/foods', data).then(res => res.data);
  },

  updateEntry: (id: string, data: Partial<FoodEntry>): Promise<ApiResponse<FoodEntry>> => {
    return apiClient.put<ApiResponse<FoodEntry>>(`/foods/${id}`, data).then(res => res.data);
  },

  deleteEntry: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/foods/${id}`).then(res => res.data);
  }
};

export const glucoseApi = {
  getEntries: (
    userId: string,
    startDate: Date,
    endDate: Date,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<ApiPagedResult<BloodGlucose>>> => {
    return apiClient.get<ApiResponse<ApiPagedResult<BloodGlucose>>>('/glucose', {
      params: {
        userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        page,
        pageSize
      }
    }).then(res => res.data);
  },

  getTodayStatistics: (userId: string): Promise<ApiResponse<GlucoseStatistics>> => {
    return apiClient.get<ApiResponse<GlucoseStatistics>>('/glucose/statistics/today', {
      params: { userId }
    }).then(res => res.data);
  },

  createEntry: (data: Partial<BloodGlucose>): Promise<ApiResponse<BloodGlucose>> => {
    return apiClient.post<ApiResponse<BloodGlucose>>('/glucose', data).then(res => res.data);
  },

  updateEntry: (id: string, data: Partial<BloodGlucose>): Promise<ApiResponse<BloodGlucose>> => {
    return apiClient.put<ApiResponse<BloodGlucose>>(`/glucose/${id}`, data).then(res => res.data);
  },

  deleteEntry: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/glucose/${id}`).then(res => res.data);
  }
};

export const medicationApi = {
  getEntries: (
    userId: string,
    startDate: Date,
    endDate: Date,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<ApiPagedResult<Medication>>> => {
    return apiClient.get<ApiResponse<ApiPagedResult<Medication>>>('/medications', {
      params: {
        userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        page,
        pageSize
      }
    }).then(res => res.data);
  },

  createEntry: (data: Partial<Medication>): Promise<ApiResponse<Medication>> => {
    return apiClient.post<ApiResponse<Medication>>('/medications', data).then(res => res.data);
  },

  updateEntry: (id: string, data: Partial<Medication>): Promise<ApiResponse<Medication>> => {
    return apiClient.put<ApiResponse<Medication>>(`/medications/${id}`, data).then(res => res.data);
  },

  markTaken: (id: string, actualTime: Date): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(`/medications/${id}/take`, { actualTime }).then(res => res.data);
  },

  deleteEntry: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/medications/${id}`).then(res => res.data);
  }
};

export const chatApi = {
  sendMessage: (message: string, userId?: string): Promise<ApiResponse<string>> => {
    return apiClient.post<ApiResponse<string>>('/chat', {
      message,
      userId: userId || 'current-user-id'
    }).then(res => res.data);
  },

  getHistory: (take: number = 50): Promise<ApiResponse<{ messages: ChatMessage[] }>> => {
    return apiClient.get<ApiResponse<{ messages: ChatMessage[] }>>(`/chat/history?take=${take}`)
      .then(res => res.data);
  }
};

export interface FoodStatistics {
  totalEntries: number;
  totalCalories: number;
  totalCarbohydrates: number;
  totalProtein: number;
  totalFat: number;
  byMealType: Record<string, number>;
}

export interface GlucoseStatistics {
  totalEntries: number;
  averageValue: number;
  minValue: number;
  maxValue: number;
  byTimeOfDay: Record<string, number>;
}
