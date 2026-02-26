using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitaNote.Application.Llm.DTOs;
using VitaNote.Application.Llm.Services;

namespace VitaNote.WebApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LlmController : ControllerBase
{
    private readonly ILlmService _llmService;
    
    public LlmController(ILlmService llmService)
    {
        _llmService = llmService;
    }
    
    [HttpPost("chat")]
    public async Task<ActionResult<ChatResponse>> Chat([FromBody] ChatRequest request)
    {
        var userId = GetUserId();
        var response = await _llmService.ChatAsync(userId, request);
        return Ok(response);
    }
    
    [HttpPost("advice")]
    public async Task<ActionResult<string>> GetAdvice([FromBody] string prompt)
    {
        var userId = GetUserId();
        var advice = await _llmService.GetHealthAdviceAsync(userId, prompt);
        return Ok(advice);
    }
    
    [HttpGet("health-data")]
    public async Task<ActionResult<IDictionary<string, string>>> GetRecentHealthData(
        [FromQuery] int days = 7)
    {
        var userId = GetUserId();
        var data = await _llmService.GetRecentHealthDataAsync(userId, days);
        return Ok(data);
    }
    
    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        return Guid.Parse(userIdClaim!);
    }
}
