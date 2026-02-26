using Microsoft.AspNetCore.Mvc;

namespace VitaNote.WebApi.Extensions;

public static class ProblemDetailsExtensions
{
    public static ProblemDetails CreateProblemDetails(this ControllerBase controller, int statusCode, string title, string? detail = null)
    {
        return new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail
        };
    }
}

public class PasswordHasher : IPasswordHasher
{
    public string HashPassword(User user, string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
    
    public bool VerifyPassword(User user, string providedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(providedPassword, user.PasswordHash);
    }
}
