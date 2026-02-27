namespace VitaNote.WebApi.DTOs;

public class FoodEntryDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public int MealType { get; set; }
    public DateTime MealTime { get; set; }
    
    public string FoodName { get; set; } = string.Empty;
    public float Quantity { get; set; }
    public float Calories { get; set; }
    public float Carbohydrates { get; set; }
    public float Protein { get; set; }
    public float Fat { get; set; }
    public float? GI { get; set; }
    public float? GL { get; set; }
    
    public int Source { get; set; }
    public string? ImagePath { get; set; }
    public string? Notes { get; set; }
}

public class CreateFoodEntryDto
{
    public Guid UserId { get; set; }
    public int MealType { get; set; }
    public DateTime MealTime { get; set; }
    
    public required string FoodName { get; set; }
    public float Quantity { get; set; }
    public float Calories { get; set; }
    public float Carbohydrates { get; set; }
    public float Protein { get; set; }
    public float Fat { get; set; }
    public float? GI { get; set; }
    public float? GL { get; set; }
    
    public string? Notes { get; set; }
}

public class UpdateFoodEntryDto
{
    public int MealType { get; set; }
    public DateTime MealTime { get; set; }
    
    public required string FoodName { get; set; }
    public float Quantity { get; set; }
    public float Calories { get; set; }
    public float Carbohydrates { get; set; }
    public float Protein { get; set; }
    public float Fat { get; set; }
    public float? GI { get; set; }
    public float? GL { get; set; }
    
    public string? Notes { get; set; }
}

public class FoodStatisticsDto
{
    public int TotalEntries { get; set; }
    public float TotalCalories { get; set; }
    public float TotalCarbohydrates { get; set; }
    public float TotalProtein { get; set; }
    public float TotalFat { get; set; }
    
    public Dictionary<string, float> ByMealType { get; set; } = new();
}
