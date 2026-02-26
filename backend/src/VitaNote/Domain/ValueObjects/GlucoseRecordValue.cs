namespace VitaNote.Domain.ValueObjects;

public record GlucoseRecordValue
{
    public required decimal GlucoseLevel { get; init; } // 单位：mmol/L
    public required DateTime RecordedAt { get; init; }
    public GlucoseType Type { get; init; } // 空腹/餐后/随机
    public string? MealType { get; init; } // 早餐/午餐/晚餐/睡前
    public string?_comment { get; init; } // 备注，如饮食或运动情况
}

public enum GlucoseType
{
    Fasting = 1,
    Postprandial = 2,
    Random = 3
}
