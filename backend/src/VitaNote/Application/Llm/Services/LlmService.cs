using Microsoft.Extensions.Options;
using VitaNote.Application.Llm.DTOs;

namespace VitaNote.Application.Llm.Services;

public class LlmService : ILlmService
{
    private readonly OllamaSettings _ollamaSettings;

    public LlmService(IOptions<OllamaSettings> ollamaSettings)
    {
        _ollamaSettings = ollamaSettings.Value;
    }

    public async Task<ChatResponse> ChatAsync(Guid userId, ChatRequest request, CancellationToken cancellationToken = default)
    {
        // 简化实现 - 实际应调用LLM API
        var response = $"我是健康助手。关于'{request.Message}',我可以为您提供一些健康建议。";

        return new ChatResponse
        {
            Response = response,
            Suggestions = new List<Suggestion>
            {
                new Suggestion { Type = "health", Title = "保持健康", Description = "建议每天运动30分钟" }
            }
        };
    }

    public async Task<string> GetHealthAdviceAsync(Guid userId, string prompt, CancellationToken cancellationToken = default)
    {
        // 简化实现
        return $"根据您的问题 '{prompt}', 建议您: 保持均衡饮食和适量运动。";
    }

    public async Task<IDictionary<string, string>> GetRecentHealthDataAsync(Guid userId, int days = 7, CancellationToken cancellationToken = default)
    {
        return new Dictionary<string, string>
        {
            { "summary", "暂无最近健康数据" }
        };
    }
}

public class OllamaSettings
{
    public required string Endpoint { get; set; } = "http://localhost:11434";
    public required string Model { get; set; } = "gpt-4o";
}
