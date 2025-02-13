namespace backend.Models.DTOs;

public record CourseRequest
{
    public Track Track { get; set; } = null!;
    public string Name { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int NumberOfWeeks { get; set; }
    public List<CourseModuleRequest> Modules { get; set; } = [];
    public List<int> ModuleIds { get; set; } = [];
    public List<Event> MiscellaneousEvents { get; set; } = [];
    public string Color { get; set; } = null!;
    public bool IsApplied { get; set; }
    public DateTime CreationDate { get; set; }
}