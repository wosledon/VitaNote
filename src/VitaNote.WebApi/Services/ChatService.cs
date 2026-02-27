using Microsoft.EntityFrameworkCore;
using VitaNote.WebApi.Data;
using VitaNote.Shared.Models;

namespace VitaNote.WebApi.Services;

public interface IChatService
{
    Task<AIChatHistory> SaveMessageAsync(Guid userId, string role, string content, string? model = null, string? context = null);
    Task<List<AIChatHistory>> GetHistoryAsync(Guid userId, int take = 50);
}

public class ChatService : IChatService
{
    private readonly ApplicationDbContext _context;

    public ChatService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AIChatHistory> SaveMessageAsync(Guid userId, string role, string content, string? model = null, string? context = null)
    {
        var history = new AIChatHistory
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            Role = role,
            Content = content,
            Model = model,
            Context = context
        };

        _context.ChatHistory.Add(history);
        await _context.SaveChangesAsync();
        return history;
    }

    public async Task<List<AIChatHistory>> GetHistoryAsync(Guid userId, int take = 50)
    {
        return await _context.ChatHistory
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.CreatedAt)
            .Take(take)
            .ToListAsync();
    }
}
