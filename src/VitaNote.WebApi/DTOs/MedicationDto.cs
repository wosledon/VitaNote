namespace VitaNote.WebApi.DTOs;

public class MedicationDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public string DrugName { get; set; } = string.Empty;
    public int Type { get; set; }
    public float Dose { get; set; }
    public string Unit { get; set; } = string.Empty;
    public int Timing { get; set; }
    
    public int? InsulinType { get; set; }
    public float? InsulinDuration { get; set; }
    
    public DateTime ScheduledTime { get; set; }
    public DateTime? ActualTime { get; set; }
    public bool IsTaken { get; set; }
    
    public string? Notes { get; set; }
}

public class CreateMedicationDto
{
    public Guid UserId { get; set; }
    public required string DrugName { get; set; }
    public int Type { get; set; }
    public float Dose { get; set; }
    public required string Unit { get; set; }
    public int Timing { get; set; }
    
    public int? InsulinType { get; set; }
    public float? InsulinDuration { get; set; }
    
    public DateTime ScheduledTime { get; set; }
    public string? Notes { get; set; }
}
