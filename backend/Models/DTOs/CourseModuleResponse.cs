namespace backend.Models.DTOs;

public record CourseModuleResponse
{
    public int CourseId { get; init; }
    public int ModuleId { get; init; }
    public ModuleResponse? Module { get; init; }

    // Constructor
    public CourseModuleResponse(CourseModule courseModule)
    {
        CourseId = courseModule.CourseId;
        ModuleId = courseModule.ModuleId;
        Module = courseModule.Module != null ? new ModuleResponse(courseModule.Module) : null;
    }

    // Implicit operator
    public static implicit operator CourseModuleResponse(CourseModule courseModule) => new(courseModule);
}