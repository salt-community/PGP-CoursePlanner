namespace backend.Models.DTOs;
public record CourseResponse
{
    public int Id { get; init; }
    public string? Name { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public int NumberOfWeeks { get; init; }
    public List<int> ModuleIds { get; init; } = new();
    public List<ModuleResponse> Modules { get; init; } = new();
    public List<CourseModuleResponse> CourseModules { get; init; } = new();
    public string? Color { get; init; }
    public bool IsApplied { get; init; }

    // Constructor
    public CourseResponse(Course course)
    {
        Id = course.Id;
        Name = course.Name;
        StartDate = course.StartDate;
        EndDate = course.EndDate;
        NumberOfWeeks = course.NumberOfWeeks;
        ModuleIds = course.Modules.Select(cm => cm.ModuleId).ToList();
        Modules = course.Modules.Select(cm => new ModuleResponse(cm.Module!)).ToList();
        CourseModules = course.Modules.Select(cm => new CourseModuleResponse(cm)).ToList();
        Color = course.Color;
        IsApplied = course.IsApplied;
    }

    // Implicit operator
    public static implicit operator CourseResponse(Course course) => new(course);
}