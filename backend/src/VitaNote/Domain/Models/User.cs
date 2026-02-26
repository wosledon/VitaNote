namespace VitaNote.Domain.Models;

public class User : BaseModel
{
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? NormalizedEmail { get; set; }
    public string? NormalizedUserName { get; set; }
    public string? PasswordHash { get; set; }
    public string? SecurityStamp { get; set; }
    public string? ConcurrencyStamp { get; set; }
    public string? PhoneNumber { get; set; }
    public bool PhoneNumberConfirmed { get; set; }
    public bool TwoFactorEnabled { get; set; }
    public DateTime? LockoutEnd { get; set; }
    public bool LockoutEnabled { get; set; }
    public int AccessFailedCount { get; set; }
    
    //.Navigation Properties
    public ICollection<HealthRecord> HealthRecords { get; set; } = new List<HealthRecord>();
    public ICollection<FoodRecord> FoodRecords { get; set; } = new List<FoodRecord>();
    public ICollection<Profile> Profiles { get; set; } = new List<Profile>();
}
