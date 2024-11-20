using System.Text.Json.Serialization;

namespace backend.Models;
public class Event
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string StartTime { get; set; }
    public required string EndTime { get; set; }
    public string? Description { get; set; }
    [JsonIgnore]
    public List<DateContent>? DateContents { get; set; }
    public bool IsApplied { get; set; } = false;

    public Event ShallowClone()
    {
        return new Event
        {
            Name = Name,
            StartTime = StartTime,
            EndTime = EndTime,
            Description = Description,
            IsApplied = IsApplied
        };
    }

    public void SetIsApplied()
    {
        IsApplied = true;
    }
}
