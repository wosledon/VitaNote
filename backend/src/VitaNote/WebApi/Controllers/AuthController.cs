using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitaNote.Application.Auth.DTOs;
using VitaNote.Application.Auth.Services;

namespace VitaNote.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        if (Guid.TryParse(userId, out var guid))
        {
            await _authService.LogoutAsync(guid);
        }
        
        return Ok(new { message = "Logged out successfully" });
    }
}
