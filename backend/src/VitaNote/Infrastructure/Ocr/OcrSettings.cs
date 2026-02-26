namespace VitaNote.Infrastructure.Ocr;

public class OcrSettings
{
    public required string Endpoint { get; set; } = "http://localhost:11434";
    public required string Model { get; set; } = "gpt-4o";
}
