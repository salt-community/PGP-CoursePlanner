
namespace backend.Models.DTOs;

public record EventResponse
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string StartTime { get; init; } = string.Empty;
    public string EndTime { get; init; } = string.Empty;
    public string? Description { get; init; }
    public bool IsApplied { get; init; }

    // Constructor
    public EventResponse(Event ev)
    {
        Id = ev.Id;
        Name = ev.Name;
        StartTime = ev.StartTime;
        EndTime = ev.EndTime;
        Description = ev.Description;
        IsApplied = ev.IsApplied;
    }

    // Implicit operator
    public static implicit operator EventResponse(Event ev) => new(ev);
}