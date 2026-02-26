namespace VitaNote.Application.HealthRecords.DTOs;

public class OCRResponse
{
    public bool Success { get; set; }
    public string? RecognizedText { get; set; }
    public decimal? Value { get; set; }
    public string? Unit { get; set; }
    public string? Message { get; set; }
}
