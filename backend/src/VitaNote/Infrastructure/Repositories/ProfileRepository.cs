using Microsoft.EntityFrameworkCore;
using VitaNote.Domain.Models;
using VitaNote.Domain.Repositories;
using VitaNote.Infrastructure.Persistence;

namespace VitaNote.Infrastructure.Repositories;

public class ProfileRepository : IProfileRepository
{
    private readonly VitaNoteDbContext _context;

    public ProfileRepository(VitaNoteDbContext context)
    {
        _context = context;
    }

    public async Task<Profile?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Profiles.FindAsync(id, cancellationToken);
    }

    public async Task<Profile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Profiles
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
    }

    public async Task AddAsync(Profile profile, CancellationToken cancellationToken = default)
    {
        await _context.Profiles.AddAsync(profile, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task UpdateAsync(Profile profile, CancellationToken cancellationToken = default)
    {
        _context.Profiles.Update(profile);
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task DeleteAsync(Profile profile, CancellationToken cancellationToken = default)
    {
        _context.Profiles.Remove(profile);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
