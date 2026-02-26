namespace VitaNote.Application.HealthRecords.DTOs;

public class WeightRecordResponse
{
    public Guid Id { get; set; }
    public decimal Weight { get; set; }
    public string? BodyFatPercentage { get; set; }
    public string? MuscleMass { get; set; }
    public string? WaterPercentage { get; set; }
    public string? Comment { get; set; }
    public DateTime RecordedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class GlucoseRecordResponse
{
    public Guid Id { get; set; }
    public decimal GlucoseLevel { get; set; }
    public GlucoseType Type { get; set; }
    public string? MealType { get; set; }
    public string? Comment { get; set; }
    public DateTime RecordedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class BloodPressureRecordResponse
{
    public Guid Id { get; set; }
    public int Systolic { get; set; }
    public int Diastolic { get; set; }
    public int HeartRate { get; set; }
    public string? Position { get; set; }
    public string? Comment { get; set; }
    public DateTime RecordedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
