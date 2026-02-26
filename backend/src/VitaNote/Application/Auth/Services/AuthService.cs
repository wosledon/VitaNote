using VitaNote.Application.Auth.DTOs;
using VitaNote.Domain.Models;
using VitaNote.Domain.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace VitaNote.Application.Auth.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;

    public AuthService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        // 检查用户是否已存在
        if (await _userRepository.GetByUsernameAsync(request.UserName, cancellationToken) != null)
        {
            throw new InvalidOperationException("用户名已存在");
        }

        if (await _userRepository.GetByEmailAsync(request.Email, cancellationToken) != null)
        {
            throw new InvalidOperationException("邮箱已存在");
        }

        // 创建用户
        var user = new User
        {
            UserName = request.UserName,
            Email = request.Email,
            NormalizedUserName = request.UserName.ToUpper(),
            NormalizedEmail = request.Email.ToUpper(),
            PhoneNumber = request.PhoneNumber,
            PhoneNumberConfirmed = false,
            LockoutEnabled = true,
            SecurityStamp = Guid.NewGuid().ToString()
        };

        // 简单密码哈希（开发环境）
        user.PasswordHash = HashPassword(request.Password);
        user.ConcurrencyStamp = Guid.NewGuid().ToString();

        await _userRepository.AddAsync(user, cancellationToken);

        // 生成令牌
        var token = GenerateJwtToken(user);

        return new AuthResponse
        {
            Token = token.Item1,
            RefreshToken = token.Item2,
            TokenExpires = DateTime.UtcNow.AddHours(24),
            User = new UserData
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            }
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByUsernameAsync(request.UserName, cancellationToken);

        if (user == null)
        {
            throw new InvalidOperationException("用户名或密码错误");
        }

        // 验证密码
        if (user.PasswordHash != HashPassword(request.Password))
        {
            throw new InvalidOperationException("用户名或密码错误");
        }

        // 检查锁定
        if (user.LockoutEnabled && user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
        {
            throw new InvalidOperationException("账户已被锁定，请稍后再试");
        }

        // 重置失败计数
        user.AccessFailedCount = 0;
        user.LockoutEnd = null;
        await _userRepository.UpdateAsync(user, cancellationToken);

        // 生成令牌
        var token = GenerateJwtToken(user);

        return new AuthResponse
        {
            Token = token.Item1,
            RefreshToken = token.Item2,
            TokenExpires = DateTime.UtcNow.AddHours(24),
            User = new UserData
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            }
        };
    }

    public Task<bool> LogoutAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        // TODO: 实现Token黑名单或刷新Token失效
        return Task.FromResult(true);
    }

    public Task<AuthResponse> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        // TODO: 实现RefreshToken验证
        throw new NotImplementedException();
    }

    private string HashPassword(string password)
    {
        // 简单密码哈希（开发环境）
        // 在生产环境中使用BCrypt
        var bytes = System.Text.Encoding.UTF8.GetBytes(password);
        var hash = System.Security.Cryptography.SHA256.HashData(bytes);
        return Convert.ToBase64String(hash);
    }

    private Tuple<string, string> GenerateJwtToken(User user)
    {
        // 生成JWT Token
        var claims = new[]
        {
            new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.UniqueName, user.UserName),
            new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email, user.Email),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("your-secret-key-change-in-production"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            issuer: "VitaNote",
            audience: "VitaNote",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials);

        var refreshToken = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            issuer: "VitaNote",
            audience: "VitaNote",
            claims: new[] { new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) },
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials);

        return new Tuple<string, string>(
            new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token),
            new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(refreshToken));
    }
}
