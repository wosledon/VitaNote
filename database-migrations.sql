# VitaNote - Database Migration Script

## SQLite

```sql
-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    Id TEXT PRIMARY KEY,
    Username TEXT UNIQUE NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    Phone TEXT,
    CreatedAt TEXT NOT NULL,
    PasswordHash TEXT NOT NULL,
    Birthday TEXT,
    Gender INTEGER NOT NULL DEFAULT 0,
    Height REAL NOT NULL DEFAULT 0,
    DiabetesType INTEGER NOT NULL DEFAULT 0,
    DiagnosisDate TEXT,
    TreatmentPlan INTEGER NOT NULL DEFAULT 0,
    TargetWeight REAL,
    TargetHbA1c REAL,
    TargetCalories REAL,
    TargetCarbohydrates REAL
);

-- Create FoodEntries table
CREATE TABLE IF NOT EXISTS FoodEntries (
    Id TEXT PRIMARY KEY,
    UserId TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    MealType INTEGER NOT NULL,
    MealTime TEXT NOT NULL,
    FoodName TEXT NOT NULL,
    Quantity REAL NOT NULL DEFAULT 0,
    Calories REAL NOT NULL DEFAULT 0,
    Carbohydrates REAL NOT NULL DEFAULT 0,
    Protein REAL NOT NULL DEFAULT 0,
    Fat REAL NOT NULL DEFAULT 0,
    GI REAL,
    GL REAL,
    Source INTEGER NOT NULL DEFAULT 0,
    ImagePath TEXT,
    Notes TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE INDEX IF NOT EXISTS idx_foods_user_date ON FoodEntries(UserId, MealTime);
CREATE INDEX IF NOT EXISTS idx_foods_user ON FoodEntries(UserId);
CREATE INDEX IF NOT EXISTS idx_foods_date ON FoodEntries(MealTime);

-- Create BloodGlucoseEntries table
CREATE TABLE IF NOT EXISTS BloodGlucoseEntries (
    Id TEXT PRIMARY KEY,
    UserId TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    Value REAL NOT NULL DEFAULT 0,
    MeasurementTime INTEGER NOT NULL DEFAULT 0,
    MeasurementTimeExact TEXT,
    BeforeMealGlucose REAL,
    AfterMealGlucose REAL,
    RelatedMeal INTEGER,
    Notes TEXT,
    DeviceName TEXT,
    DeviceSerial TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE INDEX IF NOT EXISTS idx_glucose_user_date ON BloodGlucoseEntries(UserId, CreatedAt);
CREATE INDEX IF NOT EXISTS idx_glucose_user ON BloodGlucoseEntries(UserId);
CREATE INDEX IF NOT EXISTS idx_glucose_date ON BloodGlucoseEntries(CreatedAt);

-- Create Medications table
CREATE TABLE IF NOT EXISTS Medications (
    Id TEXT PRIMARY KEY,
    UserId TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    DrugName TEXT NOT NULL,
    Type INTEGER NOT NULL DEFAULT 0,
    Dose REAL NOT NULL DEFAULT 0,
    Unit TEXT NOT NULL,
    Timing INTEGER NOT NULL DEFAULT 0,
    InsulinType INTEGER,
    InsulinDuration REAL,
    ScheduledTime TEXT NOT NULL,
    ActualTime TEXT,
    IsTaken INTEGER NOT NULL DEFAULT 0,
    Notes TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE INDEX IF NOT EXISTS idx_medication_user ON Medications(UserId);
CREATE INDEX IF NOT EXISTS idx_medication_user_date ON Medications(UserId, ScheduledTime);

-- Create AIChatHistory table
CREATE TABLE IF NOT EXISTS AIChatHistory (
    Id TEXT PRIMARY KEY,
    UserId TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    Role TEXT NOT NULL,
    Content TEXT NOT NULL,
    Model TEXT,
    Context TEXT,
    Prompt TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE INDEX IF NOT EXISTS idx_chat_user_date ON AIChatHistory(UserId, CreatedAt);
CREATE INDEX IF NOT EXISTS idx_chat_user ON AIChatHistory(UserId);
CREATE INDEX IF NOT EXISTS idx_chat_date ON AIChatHistory(CreatedAt);
```

## PostgreSQL

```sql
-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" UUID PRIMARY KEY,
    "Username" TEXT UNIQUE NOT NULL,
    "Email" TEXT UNIQUE NOT NULL,
    "Phone" TEXT,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "PasswordHash" TEXT NOT NULL,
    "Birthday" DATE,
    "Gender" INTEGER NOT NULL DEFAULT 0,
    "Height" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "DiabetesType" INTEGER NOT NULL DEFAULT 0,
    "DiagnosisDate" DATE,
    "TreatmentPlan" INTEGER NOT NULL DEFAULT 0,
    "TargetWeight" DOUBLE PRECISION,
    "TargetHbA1c" DOUBLE PRECISION,
    "TargetCalories" DOUBLE PRECISION,
    "TargetCarbohydrates" DOUBLE PRECISION
);

-- Create FoodEntries table
CREATE TABLE IF NOT EXISTS "FoodEntries" (
    "Id" UUID PRIMARY KEY,
    "UserId" UUID NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "MealType" INTEGER NOT NULL,
    "MealTime" TIMESTAMPTZ NOT NULL,
    "FoodName" TEXT NOT NULL,
    "Quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "Calories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "Carbohydrates" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "Protein" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "Fat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "GI" DOUBLE PRECISION,
    "GL" DOUBLE PRECISION,
    "Source" INTEGER NOT NULL DEFAULT 0,
    "ImagePath" TEXT,
    "Notes" TEXT,
    FOREIGN KEY ("UserId") REFERENCES "Users"("Id")
);

CREATE INDEX IF NOT EXISTS idx_foods_user_date ON "FoodEntries"("UserId", "MealTime");
CREATE INDEX IF NOT EXISTS idx_foods_user ON "FoodEntries"("UserId");
CREATE INDEX IF NOT EXISTS idx_foods_date ON "FoodEntries"("MealTime");

-- Create BloodGlucoseEntries table
CREATE TABLE IF NOT EXISTS "BloodGlucoseEntries" (
    "Id" UUID PRIMARY KEY,
    "UserId" UUID NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "Value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "MeasurementTime" INTEGER NOT NULL DEFAULT 0,
    "MeasurementTimeExact" TIMESTAMPTZ,
    "BeforeMealGlucose" DOUBLE PRECISION,
    "AfterMealGlucose" DOUBLE PRECISION,
    "RelatedMeal" INTEGER,
    "Notes" TEXT,
    "DeviceName" TEXT,
    "DeviceSerial" TEXT,
    FOREIGN KEY ("UserId") REFERENCES "Users"("Id")
);

CREATE INDEX IF NOT EXISTS idx_glucose_user_date ON "BloodGlucoseEntries"("UserId", "CreatedAt");
CREATE INDEX IF NOT EXISTS idx_glucose_user ON "BloodGlucoseEntries"("UserId");
CREATE INDEX IF NOT EXISTS idx_glucose_date ON "BloodGlucoseEntries"("CreatedAt");

-- Create Medications table
CREATE TABLE IF NOT EXISTS "Medications" (
    "Id" UUID PRIMARY KEY,
    "UserId" UUID NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "DrugName" TEXT NOT NULL,
    "Type" INTEGER NOT NULL DEFAULT 0,
    "Dose" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "Unit" TEXT NOT NULL,
    "Timing" INTEGER NOT NULL DEFAULT 0,
    "InsulinType" INTEGER,
    "InsulinDuration" DOUBLE PRECISION,
    "ScheduledTime" TIMESTAMPTZ NOT NULL,
    "ActualTime" TIMESTAMPTZ,
    "IsTaken" BOOLEAN NOT NULL DEFAULT FALSE,
    "Notes" TEXT,
    FOREIGN KEY ("UserId") REFERENCES "Users"("Id")
);

CREATE INDEX IF NOT EXISTS idx_medication_user ON "Medications"("UserId");
CREATE INDEX IF NOT EXISTS idx_medication_user_date ON "Medications"("UserId", "ScheduledTime");

-- Create AIChatHistory table
CREATE TABLE IF NOT EXISTS "AIChatHistory" (
    "Id" UUID PRIMARY KEY,
    "UserId" UUID NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "Role" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "Model" TEXT,
    "Context" TEXT,
    "Prompt" TEXT,
    FOREIGN KEY ("UserId") REFERENCES "Users"("Id")
);

CREATE INDEX IF NOT EXISTS idx_chat_user_date ON "AIChatHistory"("UserId", "CreatedAt");
CREATE INDEX IF NOT EXISTS idx_chat_user ON "AIChatHistory"("UserId");
CREATE INDEX IF NOT EXISTS idx_chat_date ON "AIChatHistory"("CreatedAt");
```

## Migration Notes

### SQLite
- Uses TEXT for UUID
- Uses INTEGER for ENUMs
- No schema prefixes

### PostgreSQL
- Uses UUID for primary keys
- Uses TIMESTAMPTZ for timestamps
- Requires quoted identifiers for mixed-case column names

### Initial Data (Seeding)
```sql
-- Insert sample food database items
INSERT INTO FoodDatabase (FoodName, Calories, Carbohydrates, Protein, Fat, GI) VALUES
('米饭，熟', 116, 25.9, 2.6, 0.3, 83),
('面条，手擀', 136, 27.5, 4.4, 0.6, 65),
('苹果', 52, 13.5, 0.3, 0.2, 36),
('香蕉', 89, 22, 1.1, 0.3, 52),
('黄瓜', 15, 3.6, 0.7, 0.1, 10);
```
