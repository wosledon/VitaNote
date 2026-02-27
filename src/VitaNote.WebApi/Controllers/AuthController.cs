using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitaNote.WebApi.Services;
using VitaNote.WebApi.DTOs;
using VitaNote.Shared.Models;
using System.Security.Claims;

namespace VitaNote.WebApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ApiControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var token = await _authService.RegisterAsync(request.Username, request.Email, request.Password);
            return Ok(new ApiResponse<string> { Success = true, Data = token });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var token = await _authService.LoginAsync(request.Email, request.Password);
            var userId = GetUserIdFromToken(token);
            var user = await _authService.GetUserByIdAsync(userId);
            
            if (user == null)
            {
                return NotFound(new ApiResponse<object> { Success = false, Message = "用户不存在" });
            }

            return Ok(new ApiResponse<LoginResponse> 
            { 
                Success = true, 
                Data = new LoginResponse 
                { 
                    Token = token,
                    UserId = user.Id,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        Phone = user.Phone,
                        CreatedAt = user.CreatedAt
                    }
                } 
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserIdFromToken();
        var user = await _authService.GetUserByIdAsync(userId);
        
        if (user == null)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "用户不存在" });
        }

        return Ok(new ApiResponse<UserDto>
        {
            Success = true,
            Data = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Phone = user.Phone,
                CreatedAt = user.CreatedAt
            }
        });
    }

    private Guid GetUserIdFromToken(string? token = null)
    {
        var tokenToUse = token ?? Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(tokenToUse);
        var userIdClaim = jwtToken.Claims.First(c => c.Type == "UserId");
        return new Guid(userIdClaim.Value);
    }
}
