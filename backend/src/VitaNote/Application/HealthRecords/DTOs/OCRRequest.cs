namespace VitaNote.Application.HealthRecords.DTOs;

public class OCRRequest
{
    public required string Base64Image { get; set; }
    public required string Type { get; set; } // "weight", "food", "glucose", "blood-pressure"
}
