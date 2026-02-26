using System.Text.Json;
using VitaNote.Domain.Repositories;
using VitaNote.Domain.Models;
using VitaNote.Application.HealthRecords.DTOs;

namespace VitaNote.Application.HealthRecords.Services;

public interface IFoodRecordService
{
    Task<Guid> AddFoodRecordAsync(Guid userId, FoodRecordRequest request, CancellationToken cancellationToken = default);
    Task<IEnumerable<FoodRecordResponse>> GetFoodRecordsByDateAsync(Guid userId, DateTime date, CancellationToken cancellationToken = default);
    Task<FoodStatisticsResponse> GetFoodStatisticsAsync(Guid userId, DateTime date, CancellationToken cancellationToken = default);
    Task<bool> DeleteFoodRecordAsync(Guid id, CancellationToken cancellationToken = default);
}

public class FoodRecordService : IFoodRecordService
{
    private readonly IFoodRecordRepository _foodRecordRepository;

    public FoodRecordService(IFoodRecordRepository foodRecordRepository)
    {
        _foodRecordRepository = foodRecordRepository;
    }

    public async Task<Guid> AddFoodRecordAsync(Guid userId, FoodRecordRequest request, CancellationToken cancellationToken = default)
    {
        var record = new FoodRecord
        {
            UserId = userId,
            FoodName = request.FoodName,
            Calories = request.Calories,
            Protein = request.Protein,
            Carbohydrates = request.Carbohydrates,
            Fat = request.Fat,
            EatenAt = request.EatenAt,
            MealType = request.MealType,
            _comment = request.Comment,
            CreatedBy = userId.ToString()
        };

        await _foodRecordRepository.AddAsync(record, cancellationToken);
        return record.Id;
    }

    public async Task<IEnumerable<FoodRecordResponse>> GetFoodRecordsByDateAsync(Guid userId, DateTime date, CancellationToken cancellationToken = default)
    {
        var records = await _foodRecordRepository.GetByDateAsync(userId, date, cancellationToken);

        return records.Select(r => new FoodRecordResponse
        {
            Id = r.Id,
            FoodName = r.FoodName,
            Calories = r.Calories,
            Protein = r.Protein,
            Carbohydrates = r.Carbohydrates,
            Fat = r.Fat,
            EatenAt = r.EatenAt,
            MealType = r.MealType,
            Comment = r._comment,
            PhotoPath = r.PhotoPath,
            CreatedAt = r.CreatedAt
        });
    }

    public async Task<FoodStatisticsResponse> GetFoodStatisticsAsync(Guid userId, DateTime date, CancellationToken cancellationToken = default)
    {
        var records = await _foodRecordRepository.GetByDateAsync(userId, date, cancellationToken);

        var stats = new FoodStatisticsResponse
        {
            TotalRecords = records.Count(),
            TotalCalories = records.Sum(r => r.Calories),
            TotalProtein = records.Sum(r => r.Protein),
            TotalCarbohydrates = records.Sum(r => r.Carbohydrates),
            TotalFat = records.Sum(r => r.Fat),
            AverageCalories = records.Any() ? records.Average(r => r.Calories) : 0
        };

        // Calculate meal time statistics
        var mealGroups = records.GroupBy(r => r.MealType ?? "Unknown");
        stats.MealTimeStats = mealGroups.Select(g => new MealTimeStat
        {
            MealType = g.Key,
            Count = g.Count(),
            Calories = g.Sum(r => r.Calories)
        }).ToList();

        return stats;
    }

    public async Task<bool> DeleteFoodRecordAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var record = await _foodRecordRepository.GetByIdAsync(id, cancellationToken);
        if (record == null) return false;

        await _foodRecordRepository.DeleteAsync(record, cancellationToken);
        return true;
    }
}
