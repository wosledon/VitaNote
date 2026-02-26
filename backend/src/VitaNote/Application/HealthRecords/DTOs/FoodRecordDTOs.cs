namespace VitaNote.Application.HealthRecords.DTOs;

public class FoodRecordRequest
{
    public required string FoodName { get; set; }
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbohydrates { get; set; }
    public decimal Fat { get; set; }
    public DateTime EatenAt { get; set; }
    public string? MealType { get; set; }
    public string? Comment { get; set; }
    public string? Base64Image { get; set; }
}

public class FoodRecordResponse
{
    public Guid Id { get; set; }
    public string FoodName { get; set; } = string.Empty;
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbohydrates { get; set; }
    public decimal Fat { get; set; }
    public DateTime EatenAt { get; set; }
    public string? MealType { get; set; }
    public string? Comment { get; set; }
    public string? PhotoPath { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class FoodStatisticsResponse
{
    public int TotalRecords { get; set; }
    public decimal TotalCalories { get; set; }
    public decimal TotalProtein { get; set; }
    public decimal TotalCarbohydrates { get; set; }
    public decimal TotalFat { get; set; }
    public decimal AverageCalories { get; set; }
    public List<MealTimeStat> MealTimeStats { get; set; } = new();
}

public class MealTimeStat
{
    public string MealType { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Calories { get; set; }
}
