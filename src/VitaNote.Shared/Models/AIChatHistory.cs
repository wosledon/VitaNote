using System;

namespace VitaNote.Shared.Models;

public class AIChatHistory
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public string Role { get; set; } = string.Empty; // user / assistant
    public string Content { get; set; } = string.Empty;
    public string? Model { get; set; }
    public string? Context { get; set; } // 上下文数据 (JSON)
    public string? Prompt { get; set; }  // 提示词 (可选)
}
