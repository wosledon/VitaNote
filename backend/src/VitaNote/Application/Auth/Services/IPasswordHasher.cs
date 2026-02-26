using VitaNote.Domain.Models;

namespace VitaNote.Application.Auth.Services;

public interface IPasswordHasher<TUser>
{
    string HashPassword(TUser user, string password);
    bool VerifyPassword(TUser user, string password);
}

public class PasswordHasher : IPasswordHasher<User>
{
    public string HashPassword(User user, string password)
    {
        // Simple password hashing for development
        // In production, use BCrypt or similar
        var bytes = System.Text.Encoding.UTF8.GetBytes(password);
        var hash = System.Security.Cryptography.SHA256.HashData(bytes);
        return Convert.ToBase64String(hash);
    }

    public bool VerifyPassword(User user, string password)
    {
        var storedHash = user.PasswordHash;
        var computedHash = HashPassword(user, password);
        return storedHash == computedHash;
    }
}
