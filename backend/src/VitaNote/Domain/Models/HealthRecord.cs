using VitaNote.Domain.ValueObjects;

namespace VitaNote.Domain.Models;

public class HealthRecord : BaseModel
{
    public required Guid UserId { get; set; }
    
    public HealthRecordType RecordType { get; set; }
    
    public string Data { get; set; } = string.Empty; // JSON格式存储ValueObject
    public string? PhotoPath { get; set; } // 可选的照片路径
    
    // 导航属性
    public User User { get; set; } = default!;
}

public enum HealthRecordType
{
    Weight = 1,
    Glucose = 2,
    BloodPressure = 3
}
