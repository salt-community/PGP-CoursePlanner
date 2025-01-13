namespace backend.Models.DTOs;
public record DayResponse
{
    public int Id { get; init; }
    public int DayNumber { get; init; }
    public string? Description { get; init; }
    public List<EventResponse> Events { get; init; } = new();
    public bool IsApplied { get; init; }
    public DateTime Date { get; init; }

    // Constructor
    public DayResponse(Day day)
    {
        Id = day.Id;
        DayNumber = day.DayNumber;
        Description = day.Description;
        Events = day.Events.Select(ev => new EventResponse(ev)).ToList();
        IsApplied = day.IsApplied;
        Date = day.Date;
    }

    // Implicit operator
    public static implicit operator DayResponse(Day day) => new(day);
}