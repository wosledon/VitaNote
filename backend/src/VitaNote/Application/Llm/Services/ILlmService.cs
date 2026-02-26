using VitaNote.Application.Llm.DTOs;

namespace VitaNote.Application.Llm.Services;

public interface ILlmService
{
    Task<ChatResponse> ChatAsync(Guid userId, ChatRequest request, CancellationToken cancellationToken = default);
    Task<string> GetHealthAdviceAsync(Guid userId, string prompt, CancellationToken cancellationToken = default);
    Task<IDictionary<string, string>> GetRecentHealthDataAsync(Guid userId, int days = 7, CancellationToken cancellationToken = default);
}
