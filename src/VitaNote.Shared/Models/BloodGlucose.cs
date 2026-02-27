using System;

namespace VitaNote.Shared.Models;

public class BloodGlucose
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // 血糖值
    public float Value { get; set; } // mmol/L
    public int MeasurementTime { get; set; }
    public DateTime? MeasurementTimeExact { get; set; }
    
    // 相关信息
    public float? BeforeMealGlucose { get; set; }
    public float? AfterMealGlucose { get; set; }
    public int? RelatedMeal { get; set; }
    public string? Notes { get; set; }
    
    // 设备信息
    public string? DeviceName { get; set; }
    public string? DeviceSerial { get; set; }
}
