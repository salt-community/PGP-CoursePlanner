using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Module
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public required string Name { get; set; }
    public int NumberOfDays { get; set; }
    public List<Day> Days { get; set; } = [];
    [Required]
    public List<Track> Tracks { get; set; } = [];
    public int Order { get; set; }
    public bool IsApplied { get; set; } = false;
    public DateTime StartDate { get; set; }
    [Required]
    public DateTime CreationDate { get; init; } = DateTime.UtcNow;

    public Module ShallowClone()
    {
        return new Module
        {
            Name = Name,
            NumberOfDays = NumberOfDays,
            Order = Order,
            IsApplied = IsApplied
        };
    }
    public void SetIsApplied()
    {
        IsApplied = true;
    }
}


