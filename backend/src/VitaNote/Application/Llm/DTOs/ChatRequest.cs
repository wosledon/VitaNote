namespace VitaNote.Application.Llm.DTOs;

public class ChatRequest
{
    public string Message { get; set; } = string.Empty;
    public Guid? HealthRecordId { get; set; } // 可选：关联的健康记录ID
    public bool IncludeHistory { get; set; } = true; // 是否包含历史记录
}
