using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitaNote.Application.HealthRecords.DTOs;
using VitaNote.Application.HealthRecords.Services;

namespace VitaNote.WebApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FoodRecordsController : ControllerBase
{
    private readonly IFoodRecordService _foodRecordService;
    private readonly IHealthRecordService _healthRecordService;

    public FoodRecordsController(IFoodRecordService foodRecordService, IHealthRecordService healthRecordService)
    {
        _foodRecordService = foodRecordService;
        _healthRecordService = healthRecordService;
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> AddFoodRecord([FromBody] FoodRecordRequest request)
    {
        var userId = GetUserId();
        var id = await _foodRecordService.AddFoodRecordAsync(userId, request);
        return Ok(id);
    }

    [HttpGet("date/{date:datetime}")]
    public async Task<ActionResult<IEnumerable<FoodRecordResponse>>> GetFoodRecordsByDate(DateTime date)
    {
        var userId = GetUserId();
        var records = await _foodRecordService.GetFoodRecordsByDateAsync(userId, date);
        return Ok(records);
    }

    [HttpGet("date/{date:datetime}/statistics")]
    public async Task<ActionResult<FoodStatisticsResponse>> GetFoodStatistics(DateTime date)
    {
        var userId = GetUserId();
        var stats = await _foodRecordService.GetFoodStatisticsAsync(userId, date);
        return Ok(stats);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteFoodRecord(Guid id)
    {
        var success = await _foodRecordService.DeleteFoodRecordAsync(id);
        if (success)
        {
            return Ok(new { message = "Food record deleted successfully" });
        }
        return NotFound();
    }

    [HttpPost("ocr")]
    public async Task<ActionResult<OCRResponse>> OCRFromImage([FromBody] OCRRequest request)
    {
        var userId = GetUserId();
        var response = await _healthRecordService.RecognizeFoodFromOCRAsync(userId, request);
        return Ok(response);
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        return Guid.Parse(userIdClaim!);
    }
}
