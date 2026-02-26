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
    
    public FoodRecordsController(IFoodRecordService foodRecordService)
    {
        _foodRecordService = foodRecordService;
    }
    
    [HttpGet("date/{date}")]
    public async Task<ActionResult<IEnumerable<FoodRecordResponse>>> GetFoodRecordsByDate(DateTime date)
    {
        var userId = GetUserId();
        var records = await _foodRecordService.GetFoodRecordsByDateAsync(userId, date);
        return Ok(records);
    }
    
    [HttpPost]
    public async Task<ActionResult<Guid>> AddFoodRecord([FromBody] FoodRecordRequest request)
    {
        var userId = GetUserId();
        var id = await _foodRecordService.AddFoodRecordAsync(userId, request);
        return Ok(id);
    }
    
    [HttpGet("date/{date}/statistics")]
    public async Task<ActionResult<FoodStatisticsResponse>> GetFoodStatistics(DateTime date)
    {
        var userId = GetUserId();
        var statistics = await _foodRecordService.GetFoodStatisticsAsync(userId, date);
        return Ok(statistics);
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> DeleteFoodRecord(Guid id)
    {
        var result = await _foodRecordService.DeleteFoodRecordAsync(id);
        return Ok(result);
    }
    
    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        return Guid.Parse(userIdClaim!);
    }
}
