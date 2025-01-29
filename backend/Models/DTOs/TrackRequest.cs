using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs;

public record TrackRequest
{
    [Required]
    public string Name { get; set; } = null!;
    [Required]
    public string Color { get; set; } = null!;
}