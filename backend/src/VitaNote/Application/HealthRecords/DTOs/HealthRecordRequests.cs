using VitaNote.Domain.ValueObjects;

namespace VitaNote.Application.HealthRecords.DTOs;

public class WeightRecordRequest
{
    public required decimal Weight { get; set; } // 单位：kg
    public string? BodyFatPercentage { get; set; }
    public string? MuscleMass { get; set; }
    public string? WaterPercentage { get; set; }
    public string? Comment { get; set; }
}

public class GlucoseRecordRequest
{
    public required decimal GlucoseLevel { get; set; } // 单位：mmol/L
    public GlucoseType Type { get; set; }
    public string? MealType { get; set; }
    public string? Comment { get; set; }
}

public class BloodPressureRecordRequest
{
    public required int Systolic { get; set; }
    public required int Diastolic { get; set; }
    public required int HeartRate { get; set; }
    public string? Position { get; set; }
    public string? Comment { get; set; }
}
