using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models;

public class Module
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public required string Name { get; set; }
    public int NumberOfDays { get; set; }
    public List<Day> Days { get; set; } = [];
    [JsonIgnore]
    public List<CourseModule> CourseModules { get; set; } = [];
    public List<int> TrackIds {get; set;} = [];
    [Required]
    public List<ModuleTrack> Tracks { get; set; } = [];
    public int Order { get; set; }
    public bool IsApplied { get; set; } = false;
    public DateTime StartDate { get; set; }

    public Module ShallowClone()
    {
        return new Module
        {
            Name = Name,
            NumberOfDays = NumberOfDays,
            TrackIds = TrackIds,
            Order = Order,
            IsApplied = IsApplied
        };
    }
    public void SetIsApplied()
    {
        IsApplied = true;
    }
}


