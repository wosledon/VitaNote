namespace VitaNote.WebApi.DTOs;

public class BloodGlucoseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public float Value { get; set; }
    public int MeasurementTime { get; set; }
    public DateTime? MeasurementTimeExact { get; set; }
    
    public float? BeforeMealGlucose { get; set; }
    public float? AfterMealGlucose { get; set; }
    public int? RelatedMeal { get; set; }
    public string? Notes { get; set; }
    
    public string? DeviceName { get; set; }
    public string? DeviceSerial { get; set; }
}

public class CreateBloodGlucoseDto
{
    public Guid UserId { get; set; }
    public float Value { get; set; }
    public int MeasurementTime { get; set; }
    public DateTime? MeasurementTimeExact { get; set; }
    
    public float? BeforeMealGlucose { get; set; }
    public float? AfterMealGlucose { get; set; }
    public int? RelatedMeal { get; set; }
    public string? Notes { get; set; }
    
    public string? DeviceName { get; set; }
}

public class GlucoseStatisticsDto
{
    public int TotalEntries { get; set; }
    public float AverageValue { get; set; }
    public float MinValue { get; set; }
    public float MaxValue { get; set; }
    
    public Dictionary<string, float> ByTimeOfDay { get; set; } = new();
}
