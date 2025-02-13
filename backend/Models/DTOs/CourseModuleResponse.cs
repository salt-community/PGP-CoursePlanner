namespace backend.Models.DTOs;

public record CourseModuleResponse
{
    public int CourseId { get; init; }
    public int ModuleId { get; init; }
    public ModuleResponse Module { get; init; }

    // Constructor
    public CourseModuleResponse(int courseId, Module module)
    {
        CourseId = courseId;
        ModuleId = module.Id;
        Module = module;
    }

    // Implicit operator
    public static implicit operator CourseModuleResponse((int courseId, Module module) tuple) => new(tuple.courseId, tuple.module);
}