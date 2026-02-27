namespace VitaNote.Shared.Enums;

public enum Gender
{
    Unknown = 0,
    Male = 1,
    Female = 2
}

public enum DiabetesType
{
    Unknown = 0,
    Type1 = 1,
    Type2 = 2,
    Gestational = 3
}

public enum TreatmentPlan
{
    DietOnly = 0,
    OralMedication = 1,
    Insulin = 2,
    Combined = 3
}

public enum MealType
{
    Breakfast = 0,
    Lunch = 1,
    Dinner = 2,
    Snack = 3
}

public enum EntrySource
{
    Manual = 0,
    FoodDatabase = 1,
    AIRecognition = 2,
    BarcodeScan = 3
}

public enum MeasurementTimeType
{
    Fasting = 0,
    BeforeMeal = 1,
    AfterMeal1h = 2,
    AfterMeal2h = 3,
    BeforeBed = 4,
    Night = 5,
    Random = 6
}

public enum MedicationType
{
    Oral = 0,
    Injection = 1,
    InsulinPump = 2
}

public enum MedicationTiming
{
    BeforeBreakfast = 0,
    BeforeLunch = 1,
    BeforeDinner = 2,
    AfterBreakfast = 3,
    AfterLunch = 4,
    AfterDinner = 5,
    BeforeBed = 6,
    AsNeeded = 7
}

public enum InsulinType
{
    Rapidacting = 0,  // 门冬、赖脯
    Shortacting = 1,  // 常规
    Intermediate = 2, // NPH
    Longacting = 3,   // 甘精、德谷
    Premixed = 4      // 预混
}
