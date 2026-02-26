namespace VitaNote.Domain.ValueObjects;

public record WeightRecordValue
{
    public required decimal Weight { get; init; } // 单位：kg
    public required DateTime RecordedAt { get; init; }
    public string? BodyFatPercentage { get; init; } // 体脂率
    public string? MuscleMass { get; init; } // 肌肉量
    public string? WaterPercentage { get; init; } // 水分百分比
    public string?_comment { get; init; } // 备注
}
