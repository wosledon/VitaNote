using VitaNote.Domain.ValueObjects;

namespace VitaNote.Domain.Models;

public class FoodRecord : BaseModel
{
    public required Guid UserId { get; set; }
    
    public string FoodName { get; set; } = string.Empty;
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbohydrates { get; set; }
    public decimal Fat { get; set; }
    public DateTime EatenAt { get; set; }
    public string? MealType { get; set; }
    public string? PhotoPath { get; set; }
    public string?_comment { get; set; }
    
    // 导航属性
    public User User { get; set; } = default!;
}
