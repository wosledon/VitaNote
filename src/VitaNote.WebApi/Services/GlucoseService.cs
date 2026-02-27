using Microsoft.EntityFrameworkCore;
using VitaNote.WebApi.Data;
using VitaNote.Shared.Models;
using VitaNote.WebApi.DTOs;

namespace VitaNote.WebApi.Services;

public interface IGlucoseService
{
    Task<PagedResult<BloodGlucose>> GetEntriesAsync(Guid userId, DateTime startDate, DateTime endDate, int page = 1, int pageSize = 20);
    Task<BloodGlucose> AddEntryAsync(BloodGlucose entry);
    Task<BloodGlucose> UpdateEntryAsync(BloodGlucose entry);
    Task DeleteEntryAsync(Guid entryId);
    Task<GlucoseStatistics> GetTodayStatisticsAsync(Guid userId);
}

public class GlucoseService : IGlucoseService
{
    private readonly ApplicationDbContext _context;

    public GlucoseService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<BloodGlucose>> GetEntriesAsync(Guid userId, DateTime startDate, DateTime endDate, int page = 1, int pageSize = 20)
    {
        var query = _context.BloodGlucoseEntries
            .Where(g => g.UserId == userId && g.CreatedAt >= startDate && g.CreatedAt <= endDate)
            .OrderByDescending(g => g.CreatedAt);

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<BloodGlucose>
        {
            Items = items,
            Total = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<BloodGlucose> AddEntryAsync(BloodGlucose entry)
    {
        entry.Id = Guid.NewGuid();
        entry.CreatedAt = DateTime.UtcNow;
        _context.BloodGlucoseEntries.Add(entry);
        await _context.SaveChangesAsync();
        return entry;
    }

    public async Task<BloodGlucose> UpdateEntryAsync(BloodGlucose entry)
    {
        _context.BloodGlucoseEntries.Update(entry);
        await _context.SaveChangesAsync();
        return entry;
    }

    public async Task DeleteEntryAsync(Guid entryId)
    {
        var entry = await _context.BloodGlucoseEntries.FindAsync(entryId);
        if (entry != null)
        {
            _context.BloodGlucoseEntries.Remove(entry);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<GlucoseStatistics> GetTodayStatisticsAsync(Guid userId)
    {
        var today = DateTime.Today;
        var tomorrow = today.AddDays(1);

        var entries = await _context.BloodGlucoseEntries
            .Where(g => g.UserId == userId && g.CreatedAt >= today && g.CreatedAt < tomorrow)
            .ToListAsync();

        var stats = new GlucoseStatistics
        {
            TotalEntries = entries.Count,
            AverageValue = entries.Count > 0 ? entries.Average(e => e.Value) : 0,
            MinValue = entries.Count > 0 ? entries.Min(e => e.Value) : 0,
            MaxValue = entries.Count > 0 ? entries.Max(e => e.Value) : 0
        };

        // 按测量时间统计
        stats.ByTimeOfDay["空腹"] = entries.Where(g => g.MeasurementTime == 0).Any() ? (float)entries.Where(g => g.MeasurementTime == 0).Average(g => g.Value) : 0;
        stats.ByTimeOfDay["餐前"] = entries.Where(g => g.MeasurementTime == 1).Any() ? (float)entries.Where(g => g.MeasurementTime == 1).Average(g => g.Value) : 0;
        stats.ByTimeOfDay["餐后1小时"] = entries.Where(g => g.MeasurementTime == 2).Any() ? (float)entries.Where(g => g.MeasurementTime == 2).Average(g => g.Value) : 0;
        stats.ByTimeOfDay["餐后2小时"] = entries.Where(g => g.MeasurementTime == 3).Any() ? (float)entries.Where(g => g.MeasurementTime == 3).Average(g => g.Value) : 0;
        stats.ByTimeOfDay["睡前"] = entries.Where(g => g.MeasurementTime == 4).Any() ? (float)entries.Where(g => g.MeasurementTime == 4).Average(g => g.Value) : 0;

        return stats;
    }
}

public class GlucoseStatistics
{
    public int TotalEntries { get; set; }
    public float AverageValue { get; set; }
    public float MinValue { get; set; }
    public float MaxValue { get; set; }
    
    public Dictionary<string, float> ByTimeOfDay { get; set; } = new();
}
