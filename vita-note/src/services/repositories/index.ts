import * as db from '../../api/tauri';
import { generateId } from '../../types';
import type { User as TauriUser, FoodEntry as TauriFoodEntry, BloodGlucose as TauriBloodGlucose, Medication as TauriMedication, ChatMessage as TauriChatMessage } from '../../api/tauri';
import type { User, FoodEntry, BloodGlucose, Medication, ChatMessage } from '../../types';

// ============ Type Conversion ============

function toTauriUser(user: Partial<User>): Partial<TauriUser> {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    password_hash: (user as any).password_hash,
    created_at: user.createdAt,
    birthday: user.birthday,
    gender: (user.gender ?? 0) as any,
    height: user.height ?? 0,
    diabetes_type: (user.diabetesType ?? 0) as any,
    diagnosis_date: user.diagnosisDate,
    treatment_plan: (user.treatmentPlan ?? 0) as any,
    target_weight: user.targetWeight,
    target_hb_a1c: user.targetHbA1c,
    target_calories: user.targetCalories,
    target_carbohydrates: user.targetCarbohydrates
  };
}

function fromTauriUser(user: TauriUser): User {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    createdAt: user.created_at,
    birthday: user.birthday,
    gender: user.gender as any,
    height: user.height,
    diabetesType: user.diabetes_type as any,
    diagnosisDate: user.diagnosis_date,
    treatmentPlan: user.treatment_plan as any,
    targetWeight: user.target_weight,
    targetHbA1c: user.target_hb_a1c,
    targetCalories: user.target_calories,
    targetCarbohydrates: user.target_carbohydrates
  };
}

function toTauriFoodEntry(entry: Partial<FoodEntry>): Partial<TauriFoodEntry> {
  return {
    id: entry.id,
    user_id: entry.userId,
    created_at: entry.createdAt,
    meal_type: (entry.mealType ?? 0) as any,
    meal_time: entry.mealTime,
    food_name: entry.foodName,
    quantity: entry.quantity,
    calories: entry.calories,
    carbohydrates: entry.carbohydrates,
    protein: entry.protein,
    fat: entry.fat,
    gi: entry.gi,
    gl: entry.gl,
    source: (entry.source ?? 0) as any,
    image_path: entry.imagePath,
    notes: entry.notes
  };
}

function fromTauriFoodEntry(entry: TauriFoodEntry): FoodEntry {
  return {
    id: entry.id,
    userId: entry.user_id,
    createdAt: entry.created_at,
    mealType: entry.meal_type as any,
    mealTime: entry.meal_time,
    foodName: entry.food_name,
    quantity: entry.quantity,
    calories: entry.calories,
    carbohydrates: entry.carbohydrates,
    protein: entry.protein,
    fat: entry.fat,
    gi: entry.gi,
    gl: entry.gl,
    source: entry.source as any,
    imagePath: entry.image_path,
    notes: entry.notes
  };
}

function toTauriBloodGlucose(entry: Partial<BloodGlucose>): Partial<TauriBloodGlucose> {
  return {
    id: entry.id,
    user_id: entry.userId,
    created_at: entry.createdAt,
    value: entry.value,
    measurement_time: (entry.measurementTime ?? 0) as any,
    measurement_time_exact: entry.measurementTimeExact,
    before_meal_glucose: entry.beforeMealGlucose,
    after_meal_glucose: entry.afterMealGlucose,
    related_meal: entry.relatedMeal,
    notes: entry.notes,
    device_name: entry.deviceName,
    device_serial: entry.deviceSerial
  };
}

function fromTauriBloodGlucose(entry: TauriBloodGlucose): BloodGlucose {
  return {
    id: entry.id,
    userId: entry.user_id,
    createdAt: entry.created_at,
    value: entry.value,
    measurementTime: entry.measurement_time as any,
    measurementTimeExact: entry.measurement_time_exact,
    beforeMealGlucose: entry.before_meal_glucose,
    afterMealGlucose: entry.after_meal_glucose,
    relatedMeal: entry.related_meal,
    notes: entry.notes,
    deviceName: entry.device_name,
    deviceSerial: entry.device_serial
  };
}

function toTauriMedication(entry: Partial<Medication>): Partial<TauriMedication> {
  return {
    id: entry.id,
    user_id: entry.userId,
    created_at: entry.createdAt,
    drug_name: entry.drugName,
    type: (entry.type ?? 0) as any,
    dose: entry.dose,
    unit: entry.unit,
    timing: (entry.timing ?? 0) as any,
    insulin_type: entry.insulinType as any,
    insulin_duration: entry.insulinDuration,
    scheduled_time: entry.scheduledTime,
    actual_time: entry.actualTime,
    is_taken: entry.isTaken,
    notes: entry.notes
  };
}

function fromTauriMedication(entry: TauriMedication): Medication {
  return {
    id: entry.id,
    userId: entry.user_id,
    createdAt: entry.created_at,
    drugName: entry.drug_name,
    type: entry.type as any,
    dose: entry.dose,
    unit: entry.unit,
    timing: entry.timing as any,
    insulinType: entry.insulin_type as any,
    insulinDuration: entry.insulin_duration,
    scheduledTime: entry.scheduled_time,
    actualTime: entry.actual_time,
    isTaken: entry.is_taken,
    notes: entry.notes
  };
}

function fromTauriChatMessage(msg: TauriChatMessage): ChatMessage {
  return {
    id: msg.id,
    userId: msg.user_id,
    createdAt: msg.created_at,
    role: msg.role as any,
    content: msg.content,
    model: msg.model
  };
}

// ============ User Repository ============

export class UserRepository {
  static async createUser(data: Partial<User>): Promise<User> {
    const id = generateId();
    const now = new Date().toISOString();

    const response = await db.userCreate({
      ...toTauriUser(data),
      id,
      created_at: now,
      password_hash: (data as any).password_hash || ''
    } as TauriUser);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create user');
    }

    return fromTauriUser(response.data);
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const response = await db.userGetByEmail(email);
    return response.data ? fromTauriUser(response.data) : null;
  }

  static async getUserById(id: string): Promise<User | null> {
    const response = await db.userGetById(id);
    return response.data ? fromTauriUser(response.data) : null;
  }

  static async updateUser(user: User): Promise<User> {
    const response = await db.userUpdate(user as any);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update user');
    }
    return fromTauriUser(response.data);
  }
}

// ============ Food Entry Repository ============

export class FoodEntryRepository {
  static async create(data: Partial<FoodEntry>): Promise<FoodEntry> {
    const id = generateId();
    const now = new Date().toISOString();

    const response = await db.foodEntryCreate({
      ...toTauriFoodEntry(data),
      id,
      created_at: now
    } as TauriFoodEntry);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create food entry');
    }

    return fromTauriFoodEntry(response.data);
  }

  static async getEntries(userId: string, startDate: Date, endDate: Date,
    page: number = 1, pageSize: number = 20): Promise<{ items: FoodEntry[], total: number }> {

    const response = await db.foodEntryGetByUser(
      userId,
      startDate.toISOString(),
      endDate.toISOString(),
      page,
      pageSize
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get food entries');
    }

    return {
      items: response.data.items.map(fromTauriFoodEntry),
      total: response.data.total
    };
  }

  static async delete(id: string): Promise<boolean> {
    const response = await db.foodEntryDelete(id);
    return response.success;
  }

  static async getTodayStatistics(userId: string): Promise<{
    totalEntries: number;
    totalCalories: number;
    totalCarbohydrates: number;
    totalProtein: number;
    totalFat: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await this.getEntries(userId, today, tomorrow);
    
    return result.items.reduce((acc, item) => {
      acc.totalEntries += 1;
      acc.totalCalories += item.calories;
      acc.totalCarbohydrates += item.carbohydrates;
      acc.totalProtein += item.protein;
      acc.totalFat += item.fat;
      return acc;
    }, {
      totalEntries: 0,
      totalCalories: 0,
      totalCarbohydrates: 0,
      totalProtein: 0,
      totalFat: 0
    });
  }
}

// ============ Blood Glucose Repository ============

export class BloodGlucoseRepository {
  static async create(data: Partial<BloodGlucose>): Promise<BloodGlucose> {
    const id = generateId();
    const now = new Date().toISOString();

    const response = await db.bloodGlucoseCreate({
      ...toTauriBloodGlucose(data),
      id,
      created_at: now
    } as TauriBloodGlucose);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create blood glucose entry');
    }

    return fromTauriBloodGlucose(response.data);
  }

  static async getEntries(userId: string, startDate: Date, endDate: Date,
    page: number = 1, pageSize: number = 20): Promise<{ items: BloodGlucose[], total: number }> {

    const response = await db.bloodGlucoseGetByUser(
      userId,
      startDate.toISOString(),
      endDate.toISOString(),
      page,
      pageSize
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get blood glucose entries');
    }

    return {
      items: response.data.items.map(fromTauriBloodGlucose),
      total: response.data.total
    };
  }

  static async delete(id: string): Promise<boolean> {
    const response = await db.bloodGlucoseDelete(id);
    return response.success;
  }

  static async getTodayStatistics(userId: string): Promise<{
    totalEntries: number;
    averageValue: number;
    minValue: number;
    maxValue: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await this.getEntries(userId, today, tomorrow);
    
    if (result.items.length === 0) {
      return {
        totalEntries: 0,
        averageValue: 0,
        minValue: 0,
        maxValue: 0
      };
    }

    const values = result.items.map(item => item.value);
    return {
      totalEntries: values.length,
      averageValue: values.reduce((a, b) => a + b, 0) / values.length,
      minValue: Math.min(...values),
      maxValue: Math.max(...values)
    };
  }
}

// ============ Medication Repository ============

export class MedicationRepository {
  static async create(data: Partial<Medication>): Promise<Medication> {
    const id = generateId();
    const now = new Date().toISOString();

    const response = await db.medicationCreate({
      ...toTauriMedication(data),
      id,
      created_at: now
    } as TauriMedication);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create medication entry');
    }

    return fromTauriMedication(response.data);
  }

  static async getEntries(userId: string, startDate: Date, endDate: Date,
    page: number = 1, pageSize: number = 20): Promise<{ items: Medication[], total: number }> {

    const response = await db.medicationGetByUser(
      userId,
      startDate.toISOString(),
      endDate.toISOString(),
      page,
      pageSize
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get medication entries');
    }

    return {
      items: response.data.items.map(fromTauriMedication),
      total: response.data.total
    };
  }

  static async markTaken(id: string, actualTime: Date): Promise<boolean> {
    const response = await db.medicationMarkTaken(id, actualTime.toISOString());
    return response.success;
  }

  static async delete(id: string): Promise<boolean> {
    const response = await db.medicationDelete(id);
    return response.success;
  }
}

// ============ Chat Message Repository ============

export class ChatMessageRepository {
  static async create(role: 'user' | 'assistant', content: string, 
    userId: string, model?: string): Promise<void> {
    
    const id = generateId();
    const now = new Date().toISOString();

    await db.chatMessageCreate({
      id,
      user_id: userId,
      created_at: now,
      role,
      content,
      model
    } as TauriChatMessage);
  }

  static async getHistory(userId: string, take: number = 50): Promise<ChatMessage[]> {
    const response = await db.chatMessageGetHistory(userId, take);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get chat history');
    }

    return response.data.map(fromTauriChatMessage).reverse();
  }
}
