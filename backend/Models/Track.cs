using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Track
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    [Required]
    public string Color { get; set; } = null!;
    public bool Visibility { get; set; } = true;
    [Required]
    public DateTime CreationDate { get; init; } = DateTime.UtcNow;
}
