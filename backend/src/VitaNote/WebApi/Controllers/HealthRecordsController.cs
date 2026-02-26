using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitaNote.Application.HealthRecords.DTOs;
using VitaNote.Application.HealthRecords.Services;

namespace VitaNote.WebApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HealthRecordsController : ControllerBase
{
    private readonly IHealthRecordService _healthRecordService;
    
    public HealthRecordsController(IHealthRecordService healthRecordService)
    {
        _healthRecordService = healthRecordService;
    }
    
    [HttpGet("weight")]
    public async Task<ActionResult<IEnumerable<WeightRecordResponse>>> GetWeightRecords(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        var userId = GetUserId();
        var records = await _healthRecordService.GetWeightRecordsAsync(userId, startDate, endDate);
        return Ok(records);
    }
    
    [HttpPost("weight")]
    public async Task<ActionResult<Guid>> AddWeightRecord([FromBody] WeightRecordRequest request)
    {
        var userId = GetUserId();
        var id = await _healthRecordService.AddWeightRecordAsync(userId, request);
        return Ok(id);
    }
    
    [HttpGet("glucose")]
    public async Task<ActionResult<IEnumerable<GlucoseRecordResponse>>> GetGlucoseRecords(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        var userId = GetUserId();
        var records = await _healthRecordService.GetGlucoseRecordsAsync(userId, startDate, endDate);
        return Ok(records);
    }
    
    [HttpPost("glucose")]
    public async Task<ActionResult<Guid>> AddGlucoseRecord([FromBody] GlucoseRecordRequest request)
    {
        var userId = GetUserId();
        var id = await _healthRecordService.AddGlucoseRecordAsync(userId, request);
        return Ok(id);
    }
    
    [HttpGet("blood-pressure")]
    public async Task<ActionResult<IEnumerable<BloodPressureRecordResponse>>> GetBloodPressureRecords(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        var userId = GetUserId();
        var records = await _healthRecordService.GetBloodPressureRecordsAsync(userId, startDate, endDate);
        return Ok(records);
    }
    
    [HttpPost("blood-pressure")]
    public async Task<ActionResult<Guid>> AddBloodPressureRecord([FromBody] BloodPressureRecordRequest request)
    {
        var userId = GetUserId();
        var id = await _healthRecordService.AddBloodPressureRecordAsync(userId, request);
        return Ok(id);
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<HealthStatisticsResponse>> GetHealthStatistics()
    {
        var userId = GetUserId();
        var statistics = await _healthRecordService.GetHealthStatisticsAsync(userId);
        return Ok(statistics);
    }

    [HttpGet("trend-analysis")]
    public async Task<ActionResult<TrendAnalysisResponse>> GetTrendAnalysis([FromQuery] int days = 30)
    {
        var userId = GetUserId();
        var analysis = await _healthRecordService.GetTrendAnalysisAsync(userId, days);
        return Ok(analysis);
    }

    [HttpGet("bmi")]
    public async Task<ActionResult<decimal?>> CalculateBMI()
    {
        var userId = GetUserId();
        var bmi = await _healthRecordService.CalculateBMIAsync(userId);
        return Ok(bmi);
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        return Guid.Parse(userIdClaim!);
    }
}
