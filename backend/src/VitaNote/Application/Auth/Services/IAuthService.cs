using VitaNote.Application.Auth.DTOs;
using VitaNote.Domain.Repositories;

namespace VitaNote.Application.Auth.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
    Task<bool> LogoutAsync(Guid userId, CancellationToken cancellationToken = default);
}
