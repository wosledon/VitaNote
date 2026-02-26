import { create } from 'zustand'
import type {
  WeightRecordResponse,
  GlucoseRecordResponse,
  BloodPressureRecordResponse,
  FoodRecordResponse,
  HealthStatisticsResponse,
  TrendAnalysisResponse,
} from '../types/api'

interface RecordsState {
  weightRecords: WeightRecordResponse[]
  glucoseRecords: GlucoseRecordResponse[]
  bloodPressureRecords: BloodPressureRecordResponse[]
  foodRecords: FoodRecordResponse[]
  statistics: HealthStatisticsResponse | null
  trendAnalysis: TrendAnalysisResponse | null
  isLoading: boolean
  error: string | null

  addWeightRecord: (record: WeightRecordResponse) => void
  addGlucoseRecord: (record: GlucoseRecordResponse) => void
  addBloodPressureRecord: (record: BloodPressureRecordResponse) => void
  addFoodRecord: (record: FoodRecordResponse) => void
  removeRecord: (recordId: string, type: 'weight' | 'glucose' | 'blood-pressure' | 'food') => void
  setRecords: (type: 'weight' | 'glucose' | 'blood-pressure' | 'food', records: any[]) => void
  setStatistics: (statistics: HealthStatisticsResponse) => void
  setTrendAnalysis: (analysis: TrendAnalysisResponse) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useRecordsStore = create<RecordsState>((set) => ({
  weightRecords: [],
  glucoseRecords: [],
  bloodPressureRecords: [],
  foodRecords: [],
  statistics: null,
  trendAnalysis: null,
  isLoading: false,
  error: null,

  addWeightRecord: (record) =>
    set((state) => ({
      weightRecords: [record, ...state.weightRecords],
    })),

  addGlucoseRecord: (record) =>
    set((state) => ({
      glucoseRecords: [record, ...state.glucoseRecords],
    })),

  addBloodPressureRecord: (record) =>
    set((state) => ({
      bloodPressureRecords: [record, ...state.bloodPressureRecords],
    })),

  addFoodRecord: (record) =>
    set((state) => ({
      foodRecords: [record, ...state.foodRecords],
    })),

  removeRecord: (recordId, type) =>
    set((state) => {
      if (type === 'weight') {
        return {
          weightRecords: state.weightRecords.filter((r) => r.id !== recordId),
        }
      }
      if (type === 'glucose') {
        return {
          glucoseRecords: state.glucoseRecords.filter((r) => r.id !== recordId),
        }
      }
      if (type === 'blood-pressure') {
        return {
          bloodPressureRecords: state.bloodPressureRecords.filter((r) => r.id !== recordId),
        }
      }
      return {
        foodRecords: state.foodRecords.filter((r) => r.id !== recordId),
      }
    }),

  setRecords: (type, records) =>
    set(() => ({
      [`${type}Records`]: records,
    })),

  setStatistics: (statistics) =>
    set({ statistics }),

  setTrendAnalysis: (analysis) =>
    set({ trendAnalysis: analysis }),

  setLoading: (loading) =>
    set({ isLoading: loading }),

  setError: (error) =>
    set({ error }),
}))
