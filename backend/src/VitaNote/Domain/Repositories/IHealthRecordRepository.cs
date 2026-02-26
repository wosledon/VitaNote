using VitaNote.Domain.Models;

namespace VitaNote.Domain.Repositories;

public interface IHealthRecordRepository
{
    Task<HealthRecord?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<HealthRecord>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<HealthRecord>> GetByTypeAsync(Guid userId, HealthRecordType type, CancellationToken cancellationToken = default);
    Task<IEnumerable<HealthRecord>> GetByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task AddAsync(HealthRecord record, CancellationToken cancellationToken = default);
    Task UpdateAsync(HealthRecord record, CancellationToken cancellationToken = default);
    Task DeleteAsync(HealthRecord record, CancellationToken cancellationToken = default);
}
