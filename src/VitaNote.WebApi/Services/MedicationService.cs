using Microsoft.EntityFrameworkCore;
using VitaNote.WebApi.Data;
using VitaNote.Shared.Models;
using VitaNote.WebApi.DTOs;

namespace VitaNote.WebApi.Services;

public interface IMedicationService
{
    Task<PagedResult<Medication>> GetEntriesAsync(Guid userId, DateTime startDate, DateTime endDate, int page = 1, int pageSize = 20);
    Task<Medication> AddEntryAsync(Medication entry);
    Task<Medication> UpdateEntryAsync(Medication entry);
    Task DeleteEntryAsync(Guid entryId);
    Task MarkTakenAsync(Guid medicationId, DateTime actualTime);
}

public class MedicationService : IMedicationService
{
    private readonly ApplicationDbContext _context;

    public MedicationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<Medication>> GetEntriesAsync(Guid userId, DateTime startDate, DateTime endDate, int page = 1, int pageSize = 20)
    {
        var query = _context.Medications
            .Where(m => m.UserId == userId && m.ScheduledTime >= startDate && m.ScheduledTime <= endDate)
            .OrderByDescending(m => m.ScheduledTime);

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Medication>
        {
            Items = items,
            Total = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<Medication> AddEntryAsync(Medication entry)
    {
        entry.Id = Guid.NewGuid();
        entry.CreatedAt = DateTime.UtcNow;
        entry.IsTaken = false;
        _context.Medications.Add(entry);
        await _context.SaveChangesAsync();
        return entry;
    }

    public async Task<Medication> UpdateEntryAsync(Medication entry)
    {
        _context.Medications.Update(entry);
        await _context.SaveChangesAsync();
        return entry;
    }

    public async Task DeleteEntryAsync(Guid entryId)
    {
        var entry = await _context.Medications.FindAsync(entryId);
        if (entry != null)
        {
            _context.Medications.Remove(entry);
            await _context.SaveChangesAsync();
        }
    }

    public async Task MarkTakenAsync(Guid medicationId, DateTime actualTime)
    {
        var medication = await _context.Medications.FindAsync(medicationId);
        if (medication != null)
        {
            medication.IsTaken = true;
            medication.ActualTime = actualTime;
            await _context.SaveChangesAsync();
        }
    }
}
