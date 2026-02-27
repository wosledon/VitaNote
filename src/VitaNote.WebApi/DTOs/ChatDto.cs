namespace VitaNote.WebApi.DTOs;

public class ChatMessageDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public string Role { get; set; } = string.Empty; // user / assistant
    public string Content { get; set; } = string.Empty;
    public string? Model { get; set; }
}

public class ChatRequest
{
    public required string Message { get; set; }
    public Guid UserId { get; set; }
    public List<ChatMessageDto>? History { get; set; }
}

public class ChatHistoryDto
{
    public Guid UserId { get; set; }
    public List<ChatMessageDto> Messages { get; set; } = new();
}
