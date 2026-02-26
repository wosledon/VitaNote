using Microsoft.EntityFrameworkCore;
using VitaNote.Domain.Models;
using VitaNote.Domain.Repositories;

namespace VitaNote.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly VitaNoteDbContext _context;

    public UserRepository(VitaNoteDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users.FindAsync(id, cancellationToken);
    }

    public async Task<User?> GetByUsernameAsync(string userName, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == userName, cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _context.Users.AddAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
