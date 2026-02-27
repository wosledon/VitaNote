using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitaNote.WebApi.Services;
using VitaNote.WebApi.DTOs;
using VitaNote.Shared.Models;

namespace VitaNote.WebApi.Controllers;

[ApiController]
[Route("api/foods")]
public class FoodController : ApiControllerBase
{
    private readonly IFoodService _foodService;

    public FoodController(IFoodService foodService)
    {
        _foodService = foodService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetEntries(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userId = new Guid(User.FindFirst("UserId")!.Value);
        var result = await _foodService.GetEntriesAsync(userId, startDate, endDate, page, pageSize);
        
        var dtos = result.Items.Select(f => new FoodEntryDto
        {
            Id = f.Id,
            UserId = f.UserId,
            CreatedAt = f.CreatedAt,
            MealType = f.MealType,
            MealTime = f.MealTime,
            FoodName = f.FoodName,
            Quantity = f.Quantity,
            Calories = f.Calories,
            Carbohydrates = f.Carbohydrates,
            Protein = f.Protein,
            Fat = f.Fat,
            GI = f.GI,
            GL = f.GL,
            Source = f.Source,
            ImagePath = f.ImagePath,
            Notes = f.Notes
        });

        return Ok(new ApiResponse<PagedResult<FoodEntryDto>>
        {
            Success = true,
            Data = new PagedResult<FoodEntryDto>
            {
                Items = dtos.ToList(),
                Total = result.Total,
                Page = result.Page,
                PageSize = result.PageSize
            }
        });
    }

    [HttpGet("statistics/today")]
    [Authorize]
    public async Task<IActionResult> GetTodayStatistics()
    {
        var userId = new Guid(User.FindFirst("UserId")!.Value);
        var stats = await _foodService.GetTodayStatisticsAsync(userId);
        
        return Ok(new ApiResponse<FoodStatisticsDto>
        {
            Success = true,
            Data = new FoodStatisticsDto
            {
                TotalEntries = stats.TotalEntries,
                TotalCalories = stats.TotalCalories,
                TotalCarbohydrates = stats.TotalCarbohydrates,
                TotalProtein = stats.TotalProtein,
                TotalFat = stats.TotalFat,
                ByMealType = stats.ByMealType
            }
        });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateEntry([FromBody] CreateFoodEntryDto dto)
    {
        var entry = new FoodEntry
        {
            UserId = dto.UserId,
            MealType = dto.MealType,
            MealTime = dto.MealTime,
            FoodName = dto.FoodName,
            Quantity = dto.Quantity,
            Calories = dto.Calories,
            Carbohydrates = dto.Carbohydrates,
            Protein = dto.Protein,
            Fat = dto.Fat,
            GI = dto.GI,
            GL = dto.GL,
            Notes = dto.Notes
        };

        var created = await _foodService.AddEntryAsync(entry);

        return Ok(new ApiResponse<FoodEntryDto>
        {
            Success = true,
            Data = new FoodEntryDto
            {
                Id = created.Id,
                UserId = created.UserId,
                CreatedAt = created.CreatedAt,
                MealType = created.MealType,
                MealTime = created.MealTime,
                FoodName = created.FoodName,
                Quantity = created.Quantity,
                Calories = created.Calories,
                Carbohydrates = created.Carbohydrates,
                Protein = created.Protein,
                Fat = created.Fat,
                GI = created.GI,
                GL = created.GL,
                Source = created.Source,
                ImagePath = created.ImagePath,
                Notes = created.Notes
            }
        });
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateEntry(Guid id, [FromBody] UpdateFoodEntryDto dto)
    {
        var userId = new Guid(User.FindFirst("UserId")!.Value);
        var result = await _foodService.GetEntriesAsync(userId, DateTime.MinValue, DateTime.MaxValue, 1, int.MaxValue);
        var existing = result.Items.FirstOrDefault(f => f.Id == id);

        if (existing == null)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "记录不存在" });
        }

        existing.MealType = dto.MealType;
        existing.MealTime = dto.MealTime;
        existing.FoodName = dto.FoodName;
        existing.Quantity = dto.Quantity;
        existing.Calories = dto.Calories;
        existing.Carbohydrates = dto.Carbohydrates;
        existing.Protein = dto.Protein;
        existing.Fat = dto.Fat;
        existing.GI = dto.GI;
        existing.GL = dto.GL;
        existing.Notes = dto.Notes;

        var updated = await _foodService.UpdateEntryAsync(existing);

        return Ok(new ApiResponse<FoodEntryDto>
        {
            Success = true,
            Data = new FoodEntryDto
            {
                Id = updated.Id,
                UserId = updated.UserId,
                CreatedAt = updated.CreatedAt,
                MealType = updated.MealType,
                MealTime = updated.MealTime,
                FoodName = updated.FoodName,
                Quantity = updated.Quantity,
                Calories = updated.Calories,
                Carbohydrates = updated.Carbohydrates,
                Protein = updated.Protein,
                Fat = updated.Fat,
                GI = updated.GI,
                GL = updated.GL,
                Source = updated.Source,
                ImagePath = updated.ImagePath,
                Notes = updated.Notes
            }
        });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteEntry(Guid id)
    {
        await _foodService.DeleteEntryAsync(id);
        return Ok(new ApiResponse<object> { Success = true, Message = "删除成功" });
    }
}
