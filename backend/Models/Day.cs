namespace backend.Models;
public class Day
{
    public int Id { get; set; }
    public int DayNumber { get; set; }
    public string? Description { get; set; }
    public List<Event> Events { get; set; } = [];
    public bool IsApplied { get; set; } = false;
    public DateTime Date {get; set;}

    public Day ShallowClone()
    {
        return new Day
        {
            DayNumber = DayNumber,
            Description = Description,
            IsApplied = IsApplied,
            Date = Date
        };
    }

    public void SetIsApplied()
    {
        IsApplied = true;
    }
}
