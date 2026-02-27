using System;

namespace VitaNote.Shared.Models;

public class Medication
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // 药物信息
    public string DrugName { get; set; } = string.Empty;
    public int Type { get; set; }
    public float Dose { get; set; }
    public string Unit { get; set; } = string.Empty;
    public int Timing { get; set; }
    
    // 胰岛素特有
    public int? InsulinType { get; set; }
    public float? InsulinDuration { get; set; }
    
    // 用药时间
    public DateTime ScheduledTime { get; set; }
    public DateTime? ActualTime { get; set; }
    public bool IsTaken { get; set; }
    
    public string? Notes { get; set; }
}
