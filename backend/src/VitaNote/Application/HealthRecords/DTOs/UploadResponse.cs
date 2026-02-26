namespace VitaNote.Application.HealthRecords.DTOs;

public class UploadResponse
{
    public bool Success { get; set; }
    public string? FilePath { get; set; }
    public string? FileName { get; set; }
    public long FileSize { get; set; }
    public string? Message { get; set; }
}
