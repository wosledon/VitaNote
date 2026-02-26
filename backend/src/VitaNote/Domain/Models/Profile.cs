namespace VitaNote.Domain.Models;

public class Profile : BaseModel
{
    public required Guid UserId { get; set; }
    
    public string? Gender { get; set; } // 性别
    public DateTime? BirthDate { get; set; } // 出生日期
    public decimal? Height { get; set; } // 身高 cm
    public string? ActivityLevel { get; set; } // 活动水平
    public string? Goals { get; set; } // 健康目标
    
    // 导航属性
    public User User { get; set; } = default!;
}
