using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitaNote.WebApi.Services;
using VitaNote.WebApi.DTOs;
using VitaNote.Shared.Models;

namespace VitaNote.WebApi.Controllers;

[ApiController]
[Route("api/glucose")]
public class GlucoseController : ApiControllerBase
{
    private readonly IGlucoseService _glucoseService;

    public GlucoseController(IGlucoseService glucoseService)
    {
        _glucoseService = glucoseService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetEntries(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userId = new Guid(User.FindFirst("UserId")!.Value);
        var result = await _glucoseService.GetEntriesAsync(userId, startDate, endDate, page, pageSize);
        
        var dtos = result.Items.Select(g => new BloodGlucoseDto
        {
            Id = g.Id,
            UserId = g.UserId,
            CreatedAt = g.CreatedAt,
            Value = g.Value,
            MeasurementTime = g.MeasurementTime,
            MeasurementTimeExact = g.MeasurementTimeExact,
            BeforeMealGlucose = g.BeforeMealGlucose,
            AfterMealGlucose = g.AfterMealGlucose,
            RelatedMeal = g.RelatedMeal,
            Notes = g.Notes,
            DeviceName = g.DeviceName,
            DeviceSerial = g.DeviceSerial
        });

        return Ok(new ApiResponse<PagedResult<BloodGlucoseDto>>
        {
            Success = true,
            Data = new PagedResult<BloodGlucoseDto>
            {
                Items = dtos.ToList(),
                Total = result.Total,
                Page = result.Page,
                PageSize = result.PageSize
            }
        });
    }

    [HttpGet("statistics/today")]
    [Authorize]
    public async Task<IActionResult> GetTodayStatistics()
    {
        var userId = new Guid(User.FindFirst("UserId")!.Value);
        var stats = await _glucoseService.GetTodayStatisticsAsync(userId);
        
        return Ok(new ApiResponse<GlucoseStatisticsDto>
        {
            Success = true,
            Data = new GlucoseStatisticsDto
            {
                TotalEntries = stats.TotalEntries,
                AverageValue = stats.AverageValue,
                MinValue = stats.MinValue,
                MaxValue = stats.MaxValue,
                ByTimeOfDay = stats.ByTimeOfDay
            }
        });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateEntry([FromBody] CreateBloodGlucoseDto dto)
    {
        var entry = new BloodGlucose
        {
            UserId = dto.UserId,
            Value = dto.Value,
            MeasurementTime = dto.MeasurementTime,
            MeasurementTimeExact = dto.MeasurementTimeExact,
            BeforeMealGlucose = dto.BeforeMealGlucose,
            AfterMealGlucose = dto.AfterMealGlucose,
            RelatedMeal = dto.RelatedMeal,
            Notes = dto.Notes,
            DeviceName = dto.DeviceName
        };

        var created = await _glucoseService.AddEntryAsync(entry);

        return Ok(new ApiResponse<BloodGlucoseDto>
        {
            Success = true,
            Data = new BloodGlucoseDto
            {
                Id = created.Id,
                UserId = created.UserId,
                CreatedAt = created.CreatedAt,
                Value = created.Value,
                MeasurementTime = created.MeasurementTime,
                MeasurementTimeExact = created.MeasurementTimeExact,
                BeforeMealGlucose = created.BeforeMealGlucose,
                AfterMealGlucose = created.AfterMealGlucose,
                RelatedMeal = created.RelatedMeal,
                Notes = created.Notes,
                DeviceName = created.DeviceName,
                DeviceSerial = created.DeviceSerial
            }
        });
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateEntry(Guid id, [FromBody] CreateBloodGlucoseDto dto)
    {
        var userId = new Guid(User.FindFirst("UserId")!.Value);
        var result = await _glucoseService.GetEntriesAsync(userId, DateTime.MinValue, DateTime.MaxValue, 1, int.MaxValue);
        var existing = result.Items.FirstOrDefault(g => g.Id == id);

        if (existing == null)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "记录不存在" });
        }

        existing.Value = dto.Value;
        existing.MeasurementTime = dto.MeasurementTime;
        existing.MeasurementTimeExact = dto.MeasurementTimeExact;
        existing.BeforeMealGlucose = dto.BeforeMealGlucose;
        existing.AfterMealGlucose = dto.AfterMealGlucose;
        existing.RelatedMeal = dto.RelatedMeal;
        existing.Notes = dto.Notes;
        existing.DeviceName = dto.DeviceName;

        var updated = await _glucoseService.UpdateEntryAsync(existing);

        return Ok(new ApiResponse<BloodGlucoseDto>
        {
            Success = true,
            Data = new BloodGlucoseDto
            {
                Id = updated.Id,
                UserId = updated.UserId,
                CreatedAt = updated.CreatedAt,
                Value = updated.Value,
                MeasurementTime = updated.MeasurementTime,
                MeasurementTimeExact = updated.MeasurementTimeExact,
                BeforeMealGlucose = updated.BeforeMealGlucose,
                AfterMealGlucose = updated.AfterMealGlucose,
                RelatedMeal = updated.RelatedMeal,
                Notes = updated.Notes,
                DeviceName = updated.DeviceName,
                DeviceSerial = updated.DeviceSerial
            }
        });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteEntry(Guid id)
    {
        await _glucoseService.DeleteEntryAsync(id);
        return Ok(new ApiResponse<object> { Success = true, Message = "删除成功" });
    }
}
