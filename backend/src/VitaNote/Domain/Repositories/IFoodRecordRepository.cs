using VitaNote.Domain.Models;

namespace VitaNote.Domain.Repositories;

public interface IFoodRecordRepository
{
    Task<FoodRecord?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<FoodRecord>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<FoodRecord>> GetByDateAsync(Guid userId, DateTime date, CancellationToken cancellationToken = default);
    Task<IEnumerable<FoodRecord>> GetByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task AddAsync(FoodRecord record, CancellationToken cancellationToken = default);
    Task UpdateAsync(FoodRecord record, CancellationToken cancellationToken = default);
    Task DeleteAsync(FoodRecord record, CancellationToken cancellationToken = default);
}
