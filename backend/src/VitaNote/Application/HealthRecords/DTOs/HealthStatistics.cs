namespace VitaNote.Application.HealthRecords.DTOs;

public class HealthStatisticsResponse
{
    public int TotalWeightRecords { get; set; }
    public int TotalGlucoseRecords { get; set; }
    public int TotalBloodPressureRecords { get; set; }
    public decimal? AverageWeight { get; set; }
    public decimal? LatestWeight { get; set; }
    public decimal? BMI { get; set; }
    public string? WeightTrend { get; set; } // "increasing", "decreasing", "stable"
    public DateTime? LastRecordedAt { get; set; }
}

public class TrendAnalysisResponse
{
    public WeightTrendData WeightTrend { get; set; } = new();
    public GlucoseTrendData GlucoseTrend { get; set; } = new();
    public BloodPressureTrendData BloodPressureTrend { get; set; } = new();
}

public class WeightTrendData
{
    public List<ChartDataPoint> DataPoints { get; set; } = new();
    public decimal? StartWeight { get; set; }
    public decimal? EndWeight { get; set; }
    public decimal? Change { get; set; }
    public decimal? ChangePercentage { get; set; }
    public string? Trend { get; set; }
}

public class GlucoseTrendData
{
    public List<ChartDataPoint> DataPoints { get; set; } = new();
    public decimal? Average { get; set; }
    public decimal? Min { get; set; }
    public decimal? Max { get; set; }
}

public class BloodPressureTrendData
{
    public List<ChartDataPoint> DataPoints { get; set; } = new();
    public int? AverageSystolic { get; set; }
    public int? AverageDiastolic { get; set; }
    public int? AverageHeartRate { get; set; }
}

public class ChartDataPoint
{
    public DateTime Date { get; set; }
    public decimal Value { get; set; }
}
