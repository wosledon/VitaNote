namespace VitaNote.Application.Llm.DTOs;

public class ChatResponse
{
    public string Response { get; set; } = string.Empty;
    public List<Suggestion> Suggestions { get; set; } = new();
}

public class Suggestion
{
    public string Type { get; set; } = string.Empty; // diet/exercise/medication
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
