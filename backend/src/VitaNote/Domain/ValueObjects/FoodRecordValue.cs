namespace VitaNote.Domain.ValueObjects;

public record FoodRecordValue
{
    public required string FoodName { get; init; } // 食物名称
    public required decimal Calories { get; init; } // 卡路里 kcal
    public required decimal Protein { get; init; } // 蛋白质 g
    public required decimal Carbohydrates { get; init; } // 碳水化合物 g
    public required decimal Fat { get; init; } // 脂肪 g
    public required DateTime EatenAt { get; init; } // 进食时间
    public string? MealType { get; init; } // 早餐/午餐/晚餐/加餐
    public string? PhotoPath { get; init; } // 食物照片路径
    public string?_comment { get; init; } // 备注
}
