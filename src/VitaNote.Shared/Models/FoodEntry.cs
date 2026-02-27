using System;

namespace VitaNote.Shared.Models;

public class FoodEntry
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // 记录信息
    public int MealType { get; set; }
    public DateTime MealTime { get; set; }
    
    // 食物信息
    public string FoodName { get; set; } = string.Empty;
    public float Quantity { get; set; } // 克数
    public float Calories { get; set; }
    public float Carbohydrates { get; set; }
    public float Protein { get; set; }
    public float Fat { get; set; }
    public float? GI { get; set; }
    public float? GL { get; set; }
    
    // 来源
    public int Source { get; set; }
    public string? ImagePath { get; set; }
    public string? Notes { get; set; }
}
