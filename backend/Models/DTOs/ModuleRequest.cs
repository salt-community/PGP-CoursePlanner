using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs;

public record ModuleRequest
{
    public string Name { get; set; } = null!;
    public int NumberOfDays { get; set; }
    public List<Day> Days { get; set; } = [];
    [Required]
    public List<Track> Tracks { get; set; } = [];
    public int Order { get; set; }
    public bool IsApplied { get; set; } = false;
    public DateTime StartDate { get; set; }
    [Required]
    public DateTime CreationDate { get; init; } = DateTime.UtcNow;
}
