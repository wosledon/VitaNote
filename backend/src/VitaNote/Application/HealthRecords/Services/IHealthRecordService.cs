using VitaNote.Domain.ValueObjects;
using VitaNote.Domain.Repositories;
using VitaNote.Domain.Models;
using VitaNote.Application.HealthRecords.DTOs;

namespace VitaNote.Application.HealthRecords.Services;

public interface IHealthRecordService
{
    Task<Guid> AddWeightRecordAsync(Guid userId, WeightRecordRequest request, CancellationToken cancellationToken = default);
    Task<Guid> AddGlucoseRecordAsync(Guid userId, GlucoseRecordRequest request, CancellationToken cancellationToken = default);
    Task<Guid> AddBloodPressureRecordAsync(Guid userId, BloodPressureRecordRequest request, CancellationToken cancellationToken = default);
    Task<IEnumerable<WeightRecordResponse>> GetWeightRecordsAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<GlucoseRecordResponse>> GetGlucoseRecordsAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<BloodPressureRecordResponse>> GetBloodPressureRecordsAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
    Task<HealthStatisticsResponse> GetHealthStatisticsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<TrendAnalysisResponse> GetTrendAnalysisAsync(Guid userId, int days = 30, CancellationToken cancellationToken = default);
    Task<decimal?> CalculateBMIAsync(Guid userId, decimal? currentWeight = null, CancellationToken cancellationToken = default);
}
