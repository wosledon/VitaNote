using VitaNote.Domain.Models;

namespace VitaNote.Domain.Repositories;

public interface IProfileRepository
{
    Task<Profile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(Profile profile, CancellationToken cancellationToken = default);
    Task UpdateAsync(Profile profile, CancellationToken cancellationToken = default);
}
