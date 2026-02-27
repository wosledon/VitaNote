using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitaNote.WebApi.Services;
using VitaNote.WebApi.DTOs;
using VitaNote.Shared.Models;

namespace VitaNote.WebApi.Controllers;

[ApiController]
[Route("api/medications")]
public class MedicationController : ApiControllerBase
{
    private readonly IMedicationService _medicationService;

    public MedicationController(IMedicationService medicationService)
    {
        _medicationService = medicationService;
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
        var result = await _medicationService.GetEntriesAsync(userId, startDate, endDate, page, pageSize);
        
        var dtos = result.Items.Select(m => new MedicationDto
        {
            Id = m.Id,
            UserId = m.UserId,
            CreatedAt = m.CreatedAt,
            DrugName = m.DrugName,
            Type = m.Type,
            Dose = m.Dose,
            Unit = m.Unit,
            Timing = m.Timing,
            InsulinType = m.InsulinType,
            InsulinDuration = m.InsulinDuration,
            ScheduledTime = m.ScheduledTime,
            ActualTime = m.ActualTime,
            IsTaken = m.IsTaken,
            Notes = m.Notes
        });

        return Ok(new ApiResponse<PagedResult<MedicationDto>>
        {
            Success = true,
            Data = new PagedResult<MedicationDto>
            {
                Items = dtos.ToList(),
                Total = result.Total,
                Page = result.Page,
                PageSize = result.PageSize
            }
        });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateEntry([FromBody] CreateMedicationDto dto)
    {
        var entry = new Medication
        {
            UserId = dto.UserId,
            DrugName = dto.DrugName,
            Type = dto.Type,
            Dose = dto.Dose,
            Unit = dto.Unit,
            Timing = dto.Timing,
            InsulinType = dto.InsulinType,
            InsulinDuration = dto.InsulinDuration,
            ScheduledTime = dto.ScheduledTime,
            Notes = dto.Notes
        };

        var created = await _medicationService.AddEntryAsync(entry);

        return Ok(new ApiResponse<MedicationDto>
        {
            Success = true,
            Data = new MedicationDto
            {
                Id = created.Id,
                UserId = created.UserId,
                CreatedAt = created.CreatedAt,
                DrugName = created.DrugName,
                Type = created.Type,
                Dose = created.Dose,
                Unit = created.Unit,
                Timing = created.Timing,
                InsulinType = created.InsulinType,
                InsulinDuration = created.InsulinDuration,
                ScheduledTime = created.ScheduledTime,
                ActualTime = created.ActualTime,
                IsTaken = created.IsTaken,
                Notes = created.Notes
            }
        });
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateEntry(Guid id, [FromBody] CreateMedicationDto dto)
    {
        var userId = new Guid(User.FindFirst("UserId")!.Value);
        var result = await _medicationService.GetEntriesAsync(userId, DateTime.MinValue, DateTime.MaxValue, 1, int.MaxValue);
        var existing = result.Items.FirstOrDefault(m => m.Id == id);

        if (existing == null)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "记录不存在" });
        }

        existing.DrugName = dto.DrugName;
        existing.Type = dto.Type;
        existing.Dose = dto.Dose;
        existing.Unit = dto.Unit;
        existing.Timing = dto.Timing;
        existing.InsulinType = dto.InsulinType;
        existing.InsulinDuration = dto.InsulinDuration;
        existing.ScheduledTime = dto.ScheduledTime;
        existing.Notes = dto.Notes;

        var updated = await _medicationService.UpdateEntryAsync(existing);

        return Ok(new ApiResponse<MedicationDto>
        {
            Success = true,
            Data = new MedicationDto
            {
                Id = updated.Id,
                UserId = updated.UserId,
                CreatedAt = updated.CreatedAt,
                DrugName = updated.DrugName,
                Type = updated.Type,
                Dose = updated.Dose,
                Unit = updated.Unit,
                Timing = updated.Timing,
                InsulinType = updated.InsulinType,
                InsulinDuration = updated.InsulinDuration,
                ScheduledTime = updated.ScheduledTime,
                ActualTime = updated.ActualTime,
                IsTaken = updated.IsTaken,
                Notes = updated.Notes
            }
        });
    }

    [HttpPost("{id}/take")]
    [Authorize]
    public async Task<IActionResult> MarkTaken(Guid id, [FromBody] MarkTakenRequest data)
    {
        await _medicationService.MarkTakenAsync(id, data.ActualTime);
        return Ok(new ApiResponse<object> { Success = true, Message = "标记成功" });
    }

    public class MarkTakenRequest
    {
        public DateTime ActualTime { get; set; }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteEntry(Guid id)
    {
        await _medicationService.DeleteEntryAsync(id);
        return Ok(new ApiResponse<object> { Success = true, Message = "删除成功" });
    }
}
