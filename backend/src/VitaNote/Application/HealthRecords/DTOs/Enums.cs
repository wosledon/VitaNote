namespace VitaNote.Application.HealthRecords.DTOs;

public enum GlucoseType
{
    Fasting = 1,      // 空腹血糖
    Postprandial = 2, // 餐后血糖
    Random = 3,       // 随机血糖
    HbA1c = 4         // 糖化血红蛋白
}

public enum MealType
{
    Breakfast = 1,    // 早餐
    Lunch = 2,        // 午餐
    Dinner = 3,       // 晚餐
    Snack = 4         // 加餐
}

public enum ActivityLevel
{
    Sedentary = 1,    // 久坐不动
    Light = 2,        // 轻度活动
    Moderate = 3,     // 中度活动
    Active = 4,       // 高度活动
    VeryActive = 5    // 非常活跃
}

public enum HealthRecordStatus
{
    Pending = 1,      // 待确认
    Confirmed = 2,    // 已确认
    Verified = 3      // 已验证
}
