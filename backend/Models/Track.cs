using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models;

public class Track
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    [Required]
    public string Color { get; set; } = null!;
    public bool Visibility { get; set; } = true;
    [JsonIgnore]
    public List<ModuleTrack> ModuleTracks {get; set;} = [];
}
