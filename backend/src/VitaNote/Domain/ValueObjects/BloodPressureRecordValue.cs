namespace VitaNote.Domain.ValueObjects;

public record BloodPressureRecordValue
{
    public required int Systolic { get; init; } // 收缩压
    public required int Diastolic { get; init; } // 舒张压
    public required DateTime RecordedAt { get; init; }
    public HeartRate heartRate { get; init; } = default!; // 心率
    public string? Position { get; init; } // 坐姿/站姿/卧位
    public string? _comment { get; init; } // 备注
}

public record HeartRate
{
    public required int BeatsPerMinute { get; init; } // 心率 bpm
}
