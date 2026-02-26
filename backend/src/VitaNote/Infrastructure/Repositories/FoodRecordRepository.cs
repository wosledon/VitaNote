using Microsoft.EntityFrameworkCore;
using VitaNote.Domain.Models;
using VitaNote.Domain.Repositories;

namespace VitaNote.Infrastructure.Repositories;

public class FoodRecordRepository : IFoodRecordRepository
{
    private readonly VitaNoteDbContext _context;
    
    public FoodRecordRepository(VitaNoteDbContext context)
    {
        _context = context;
    }
    
    public async Task<FoodRecord?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.FoodRecords.FindAsync(id, cancellationToken);
    }
    
    public async Task<IEnumerable<FoodRecord>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.FoodRecords
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.EatenAt)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<IEnumerable<FoodRecord>> GetByDateAsync(Guid userId, DateTime date, CancellationToken cancellationToken = default)
    {
        var startOfDay = date.Date;
        var endOfDay = date.Date.AddDays(1);
        
        return await _context.FoodRecords
            .Where(r => r.UserId == userId && r.EatenAt >= startOfDay && r.EatenAt < endOfDay)
            .OrderByDescending(r => r.EatenAt)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<IEnumerable<FoodRecord>> GetByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.FoodRecords
            .Where(r => r.UserId == userId && r.EatenAt >= startDate && r.EatenAt <= endDate)
            .OrderByDescending(r => r.EatenAt)
            .ToListAsync(cancellationToken);
    }
    
    public async Task AddAsync(FoodRecord record, CancellationToken cancellationToken = default)
    {
        await _context.FoodRecords.AddAsync(record, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task UpdateAsync(FoodRecord record, CancellationToken cancellationToken = default)
    {
        _context.FoodRecords.Update(record);
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task DeleteAsync(FoodRecord record, CancellationToken cancellationToken = default)
    {
        _context.FoodRecords.Remove(record);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
