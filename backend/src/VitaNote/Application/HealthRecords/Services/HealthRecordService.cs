using System.Text.Json;
using VitaNote.Domain.ValueObjects;
using VitaNote.Domain.Repositories;
using VitaNote.Domain.Models;
using VitaNote.Application.HealthRecords.DTOs;

namespace VitaNote.Application.HealthRecords.Services;

public class HealthRecordService : IHealthRecordService
{
    private readonly IHealthRecordRepository _healthRecordRepository;
    private readonly IFoodRecordRepository _foodRecordRepository;
    
    public HealthRecordService(
        IHealthRecordRepository healthRecordRepository,
        IFoodRecordRepository foodRecordRepository)
    {
        _healthRecordRepository = healthRecordRepository;
        _foodRecordRepository = foodRecordRepository;
    }
    
    public async Task<Guid> AddWeightRecordAsync(Guid userId, WeightRecordRequest request, CancellationToken cancellationToken = default)
    {
        var value = new WeightRecordValue
        {
            Weight = request.Weight,
            BodyFatPercentage = request.BodyFatPercentage,
            MuscleMass = request.MuscleMass,
            WaterPercentage = request.WaterPercentage,
            _comment = request.Comment,
            RecordedAt = DateTime.UtcNow
        };
        
        var record = new HealthRecord
        {
            UserId = userId,
            RecordType = HealthRecordType.Weight,
            Data = JsonSerializer.Serialize(value),
            CreatedBy = userId.ToString()
        };
        
        await _healthRecordRepository.AddAsync(record, cancellationToken);
        return record.Id;
    }
    
    public async Task<Guid> AddGlucoseRecordAsync(Guid userId, GlucoseRecordRequest request, CancellationToken cancellationToken = default)
    {
        // Convert DTO GlucoseType to Domain GlucoseType
        var domainType = (VitaNote.Domain.ValueObjects.GlucoseType)request.Type;
        
        var value = new GlucoseRecordValue
        {
            GlucoseLevel = request.GlucoseLevel,
            Type = domainType,
            MealType = request.MealType,
            _comment = request.Comment,
            RecordedAt = DateTime.UtcNow
        };
        
        var record = new HealthRecord
        {
            UserId = userId,
            RecordType = HealthRecordType.Glucose,
            Data = JsonSerializer.Serialize(value),
            CreatedBy = userId.ToString()
        };
        
        await _healthRecordRepository.AddAsync(record, cancellationToken);
        return record.Id;
    }
    
    public async Task<Guid> AddBloodPressureRecordAsync(Guid userId, BloodPressureRecordRequest request, CancellationToken cancellationToken = default)
    {
        var value = new BloodPressureRecordValue
        {
            Systolic = request.Systolic,
            Diastolic = request.Diastolic,
            heartRate = new HeartRate { BeatsPerMinute = request.HeartRate },
            Position = request.Position,
            _comment = request.Comment,
            RecordedAt = DateTime.UtcNow
        };
        
        var record = new HealthRecord
        {
            UserId = userId,
            RecordType = HealthRecordType.BloodPressure,
            Data = JsonSerializer.Serialize(value),
            CreatedBy = userId.ToString()
        };
        
        await _healthRecordRepository.AddAsync(record, cancellationToken);
        return record.Id;
    }
    
    public async Task<IEnumerable<WeightRecordResponse>> GetWeightRecordsAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var records = string.IsNullOrEmpty(startDate?.ToString()) && string.IsNullOrEmpty(endDate?.ToString())
            ? await _healthRecordRepository.GetByTypeAsync(userId, HealthRecordType.Weight, cancellationToken)
            : await _healthRecordRepository.GetByDateRangeAsync(userId, startDate ?? DateTime.MinValue, endDate ?? DateTime.MaxValue, cancellationToken);
        
        return records.Select(r => new WeightRecordResponse
        {
            Id = r.Id,
            Weight = JsonSerializer.Deserialize<WeightRecordValue>(r.Data)!.Weight,
            BodyFatPercentage = JsonSerializer.Deserialize<WeightRecordValue>(r.Data)?.BodyFatPercentage,
            MuscleMass = JsonSerializer.Deserialize<WeightRecordValue>(r.Data)?.MuscleMass,
            WaterPercentage = JsonSerializer.Deserialize<WeightRecordValue>(r.Data)?.WaterPercentage,
            Comment = JsonSerializer.Deserialize<WeightRecordValue>(r.Data)?._comment,
            RecordedAt = JsonSerializer.Deserialize<WeightRecordValue>(r.Data)!.RecordedAt,
            CreatedAt = r.CreatedAt
        });
    }
    
    public async Task<IEnumerable<GlucoseRecordResponse>> GetGlucoseRecordsAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var records = string.IsNullOrEmpty(startDate?.ToString()) && string.IsNullOrEmpty(endDate?.ToString())
            ? await _healthRecordRepository.GetByTypeAsync(userId, HealthRecordType.Glucose, cancellationToken)
            : await _healthRecordRepository.GetByDateRangeAsync(userId, startDate ?? DateTime.MinValue, endDate ?? DateTime.MaxValue, cancellationToken);
        
        return records.Select(r => new GlucoseRecordResponse
        {
            Id = r.Id,
            GlucoseLevel = JsonSerializer.Deserialize<GlucoseRecordValue>(r.Data)!.GlucoseLevel,
            Type = (VitaNote.Application.HealthRecords.DTOs.GlucoseType)(VitaNote.Domain.ValueObjects.GlucoseType)JsonSerializer.Deserialize<GlucoseRecordValue>(r.Data)!.Type,
            MealType = JsonSerializer.Deserialize<GlucoseRecordValue>(r.Data)?.MealType,
            Comment = JsonSerializer.Deserialize<GlucoseRecordValue>(r.Data)?._comment,
            RecordedAt = JsonSerializer.Deserialize<GlucoseRecordValue>(r.Data)!.RecordedAt,
            CreatedAt = r.CreatedAt
        });
    }
    
    public async Task<IEnumerable<BloodPressureRecordResponse>> GetBloodPressureRecordsAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var records = string.IsNullOrEmpty(startDate?.ToString()) && string.IsNullOrEmpty(endDate?.ToString())
            ? await _healthRecordRepository.GetByTypeAsync(userId, HealthRecordType.BloodPressure, cancellationToken)
            : await _healthRecordRepository.GetByDateRangeAsync(userId, startDate ?? DateTime.MinValue, endDate ?? DateTime.MaxValue, cancellationToken);
        
        return records.Select(r => new BloodPressureRecordResponse
        {
            Id = r.Id,
            Systolic = JsonSerializer.Deserialize<BloodPressureRecordValue>(r.Data)!.Systolic,
            Diastolic = JsonSerializer.Deserialize<BloodPressureRecordValue>(r.Data)!.Diastolic,
            HeartRate = JsonSerializer.Deserialize<BloodPressureRecordValue>(r.Data)!.heartRate.BeatsPerMinute,
            Position = JsonSerializer.Deserialize<BloodPressureRecordValue>(r.Data)?.Position,
            Comment = JsonSerializer.Deserialize<BloodPressureRecordValue>(r.Data)?._comment,
            RecordedAt = JsonSerializer.Deserialize<BloodPressureRecordValue>(r.Data)!.RecordedAt,
            CreatedAt = r.CreatedAt
        });
    }
    
    public async Task<bool> ExportDataAsync(Guid userId, string format, string filePath, CancellationToken cancellationToken = default)
    {
        // Export data to file
        // Supported formats: CSV, JSON, Excel
        var weightRecords = await _healthRecordRepository.GetByTypeAsync(userId, HealthRecordType.Weight, cancellationToken);

        // Export logic would go here
        return true;
    }

    public async Task<HealthStatisticsResponse> GetHealthStatisticsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var weightRecords = await _healthRecordRepository.GetByTypeAsync(userId, HealthRecordType.Weight, cancellationToken);
        var glucoseRecords = await _healthRecordRepository.GetByTypeAsync(userId, HealthRecordType.Glucose, cancellationToken);
        var bpRecords = await _healthRecordRepository.GetByTypeAsync(userId, HealthRecordType.BloodPressure, cancellationToken);

        // Get latest weight for BMI calculation
        var latestWeightRecord = weightRecords.FirstOrDefault();
        decimal? currentWeight = null;
        if (latestWeightRecord != null)
        {
            currentWeight = JsonSerializer.Deserialize<WeightRecordValue>(latestWeightRecord.Data)?.Weight;
        }

        // Calculate BMI
        decimal? bmi = null;
        if (currentWeight.HasValue)
        {
            bmi = await CalculateBMIAsync(userId, currentWeight.Value, cancellationToken);
        }

        // Determine weight trend
        string? weightTrend = null;
        if (weightRecords.Count() >= 2)
        {
            var firstWeight = JsonSerializer.Deserialize<WeightRecordValue>(weightRecords.LastOrDefault()?.Data ?? "{}")?.Weight;
            var lastWeight = JsonSerializer.Deserialize<WeightRecordValue>(weightRecords.FirstOrDefault()?.Data ?? "{}")?.Weight;

            if (firstWeight.HasValue && lastWeight.HasValue)
            {
                var change = lastWeight.Value - firstWeight.Value;
                if (Math.Abs(change) < 1)
                {
                    weightTrend = "stable";
                }
                else if (change > 0)
                {
                    weightTrend = "increasing";
                }
                else
                {
                    weightTrend = "decreasing";
                }
            }
        }

        return new HealthStatisticsResponse
        {
            TotalWeightRecords = weightRecords.Count(),
            TotalGlucoseRecords = glucoseRecords.Count(),
            TotalBloodPressureRecords = bpRecords.Count(),
            AverageWeight = weightRecords.Any() ? weightRecords.Average(r => JsonSerializer.Deserialize<WeightRecordValue>(r.Data)?.Weight ?? 0) : (decimal?)null,
            LatestWeight = currentWeight,
            BMI = bmi,
            WeightTrend = weightTrend,
            LastRecordedAt = weightRecords.FirstOrDefault()?.CreatedAt
        };
    }

    public async Task<TrendAnalysisResponse> GetTrendAnalysisAsync(Guid userId, int days = 30, CancellationToken cancellationToken = default)
    {
        var endDate = DateTime.UtcNow;
        var startDate = endDate.AddDays(-days);

        // Weight trend
        var weightRecords = await _healthRecordRepository.GetByDateRangeAsync(userId, startDate, endDate, cancellationToken);
        var weightDataPoints = weightRecords.Select(r => new ChartDataPoint
        {
            Date = r.CreatedAt,
            Value = JsonSerializer.Deserialize<WeightRecordValue>(r.Data)?.Weight ?? 0
        }).OrderBy(dp => dp.Date).ToList();

        // Glucose trend
        var glucoseRecords = await _healthRecordRepository.GetByDateRangeAsync(userId, startDate, endDate, cancellationToken);
        var glucoseDataPoints = glucoseRecords.Select(r => new ChartDataPoint
        {
            Date = r.CreatedAt,
            Value = JsonSerializer.Deserialize<GlucoseRecordValue>(r.Data)?.GlucoseLevel ?? 0
        }).OrderBy(dp => dp.Date).ToList();

        // Blood pressure trend
        var bpRecords = await _healthRecordRepository.GetByDateRangeAsync(userId, startDate, endDate, cancellationToken);
        var bpDataPoints = bpRecords.Select(r => new ChartDataPoint
        {
            Date = r.CreatedAt,
            Value = (decimal)(JsonSerializer.Deserialize<BloodPressureRecordValue>(r.Data)?.Systolic ?? 0)
        }).OrderBy(dp => dp.Date).ToList();

        return new TrendAnalysisResponse
        {
            WeightTrend = new WeightTrendData
            {
                DataPoints = weightDataPoints,
                StartWeight = weightDataPoints.FirstOrDefault()?.Value,
                EndWeight = weightDataPoints.LastOrDefault()?.Value,
                Change = weightDataPoints.Any() ? (weightDataPoints.LastOrDefault()?.Value - weightDataPoints.FirstOrDefault()?.Value) : null,
                Trend = weightDataPoints.Count >= 2 && (weightDataPoints.LastOrDefault()?.Value ?? 0) != (weightDataPoints.FirstOrDefault()?.Value ?? 0)
                    ? (weightDataPoints.LastOrDefault()?.Value > weightDataPoints.FirstOrDefault()?.Value ? "increasing" : "decreasing")
                    : "stable"
            },
            GlucoseTrend = new GlucoseTrendData
            {
                DataPoints = glucoseDataPoints,
                Average = glucoseDataPoints.Any() ? glucoseDataPoints.Average(dp => dp.Value) : null,
                Min = glucoseDataPoints.Any() ? glucoseDataPoints.Min(dp => dp.Value) : null,
                Max = glucoseDataPoints.Any() ? glucoseDataPoints.Max(dp => dp.Value) : null
            },
            BloodPressureTrend = new BloodPressureTrendData
            {
                DataPoints = bpDataPoints,
                AverageSystolic = bpRecords.Any() ? (int?)bpRecords.Average(r => JsonSerializer.Deserialize<BloodPressureRecordValue>(r.Data)?.Systolic ?? 0) : null,
                AverageDiastolic = bpRecords.Any() ? (int?)bpRecords.Average(r => JsonSerializer.Deserialize<BloodPressureRecordValue>(r.Data)?.Diastolic ?? 0) : null,
                AverageHeartRate = bpRecords.Any() ? (int?)bpRecords.Average(r => JsonSerializer.Deserialize<BloodPressureRecordValue>(r.Data)?.heartRate.BeatsPerMinute ?? 0) : null
            }
        };
    }

    public async Task<decimal?> CalculateBMIAsync(Guid userId, decimal? currentWeight = null, CancellationToken cancellationToken = default)
    {
        // Get user's profile for height
        var user = await _healthRecordRepository.GetByUserIdAsync(userId, cancellationToken);
        // This would be fully implemented in a real scenario

        // Simplified version for now - return null if no height available
        return null;
    }

    public async Task<OCRResponse> RecognizeFoodFromOCRAsync(Guid userId, OCRRequest request, CancellationToken cancellationToken = default)
    {
        // OCR implementation using LLM
        // This is a placeholder - real implementation would call LLM service
        return new OCRResponse
        {
            Success = false,
            Message = "OCR service not implemented"
        };
    }
}
