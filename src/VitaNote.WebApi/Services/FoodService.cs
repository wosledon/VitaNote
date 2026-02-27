using Microsoft.EntityFrameworkCore;
using VitaNote.WebApi.Data;
using VitaNote.Shared.Models;
using VitaNote.WebApi.DTOs;

namespace VitaNote.WebApi.Services;

public interface IFoodService
{
    Task<PagedResult<FoodEntry>> GetEntriesAsync(Guid userId, DateTime startDate, DateTime endDate, int page = 1, int pageSize = 20);
    Task<FoodEntry> AddEntryAsync(FoodEntry entry);
    Task<FoodEntry> UpdateEntryAsync(FoodEntry entry);
    Task DeleteEntryAsync(Guid entryId);
    Task<FoodStatistics> GetTodayStatisticsAsync(Guid userId);
}

public class FoodService : IFoodService
{
    private readonly ApplicationDbContext _context;

    public FoodService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<FoodEntry>> GetEntriesAsync(Guid userId, DateTime startDate, DateTime endDate, int page = 1, int pageSize = 20)
    {
        var query = _context.FoodEntries
            .Where(f => f.UserId == userId && f.MealTime >= startDate && f.MealTime <= endDate)
            .OrderByDescending(f => f.MealTime);

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<FoodEntry>
        {
            Items = items,
            Total = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<FoodEntry> AddEntryAsync(FoodEntry entry)
    {
        entry.Id = Guid.NewGuid();
        entry.CreatedAt = DateTime.UtcNow;
        _context.FoodEntries.Add(entry);
        await _context.SaveChangesAsync();
        return entry;
    }

    public async Task<FoodEntry> UpdateEntryAsync(FoodEntry entry)
    {
        _context.FoodEntries.Update(entry);
        await _context.SaveChangesAsync();
        return entry;
    }

    public async Task DeleteEntryAsync(Guid entryId)
    {
        var entry = await _context.FoodEntries.FindAsync(entryId);
        if (entry != null)
        {
            _context.FoodEntries.Remove(entry);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<FoodStatistics> GetTodayStatisticsAsync(Guid userId)
    {
        var today = DateTime.Today;
        var tomorrow = today.AddDays(1);

        var entries = await _context.FoodEntries
            .Where(f => f.UserId == userId && f.MealTime >= today && f.MealTime < tomorrow)
            .ToListAsync();

        var stats = new FoodStatistics
        {
            TotalEntries = entries.Count,
            TotalCalories = entries.Sum(e => e.Calories),
            TotalCarbohydrates = entries.Sum(e => e.Carbohydrates),
            TotalProtein = entries.Sum(e => e.Protein),
            TotalFat = entries.Sum(e => e.Fat)
        };

        // 按餐次统计
        stats.ByMealType["早餐"] = entries.Where(e => e.MealType == 0).Sum(e => e.Calories);
        stats.ByMealType["午餐"] = entries.Where(e => e.MealType == 1).Sum(e => e.Calories);
        stats.ByMealType["晚餐"] = entries.Where(e => e.MealType == 2).Sum(e => e.Calories);
        stats.ByMealType["加餐"] = entries.Where(e => e.MealType == 3).Sum(e => e.Calories);

        return stats;
    }
}

public class FoodStatistics
{
    public int TotalEntries { get; set; }
    public float TotalCalories { get; set; }
    public float TotalCarbohydrates { get; set; }
    public float TotalProtein { get; set; }
    public float TotalFat { get; set; }
    
    public Dictionary<string, float> ByMealType { get; set; } = new();
}
