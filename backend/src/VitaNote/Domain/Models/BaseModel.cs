using System.ComponentModel.DataAnnotations;

namespace VitaNote.Domain.Models;

public abstract class BaseModel
{
    [Key]
    public Guid Id { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string? UpdatedBy { get; set; }
}
