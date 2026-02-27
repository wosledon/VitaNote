using System;

namespace VitaNote.Shared.Models;

public class User
{
    public Guid Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // 密码哈希
    public required string PasswordHash { get; set; }
    
    // 个人资料
    public DateOnly? Birthday { get; set; }
    public int Gender { get; set; }
    public float Height { get; set; } // cm
    
    // 糖尿病信息
    public int DiabetesType { get; set; }
    public DateTime? DiagnosisDate { get; set; }
    public int TreatmentPlan { get; set; }
    
    // 目标
    public float? TargetWeight { get; set; }
    public float? TargetHbA1c { get; set; }
    public float? TargetCalories { get; set; }
    public float? TargetCarbohydrates { get; set; }
}
