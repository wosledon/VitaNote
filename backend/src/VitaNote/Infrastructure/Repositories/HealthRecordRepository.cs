using Microsoft.EntityFrameworkCore;
using VitaNote.Domain.Models;
using VitaNote.Domain.Repositories;
using VitaNote.Infrastructure.Persistence;

namespace VitaNote.Infrastructure.Repositories;

public class HealthRecordRepository : IHealthRecordRepository
{
    private readonly VitaNoteDbContext _context;
    
    public HealthRecordRepository(VitaNoteDbContext context)
    {
        _context = context;
    }
    
    public async Task<HealthRecord?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.HealthRecords.FindAsync(id, cancellationToken);
    }
    
    public async Task<IEnumerable<HealthRecord>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.HealthRecords
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<IEnumerable<HealthRecord>> GetByTypeAsync(Guid userId, HealthRecordType type, CancellationToken cancellationToken = default)
    {
        return await _context.HealthRecords
            .Where(r => r.UserId == userId && r.RecordType == type)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<IEnumerable<HealthRecord>> GetByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.HealthRecords
            .Where(r => r.UserId == userId && r.CreatedAt >= startDate && r.CreatedAt <= endDate)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }
    
    public async Task AddAsync(HealthRecord record, CancellationToken cancellationToken = default)
    {
        await _context.HealthRecords.AddAsync(record, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task UpdateAsync(HealthRecord record, CancellationToken cancellationToken = default)
    {
        _context.HealthRecords.Update(record);
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task DeleteAsync(HealthRecord record, CancellationToken cancellationToken = default)
    {
        _context.HealthRecords.Remove(record);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
