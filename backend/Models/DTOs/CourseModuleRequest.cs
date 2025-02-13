namespace backend.Models.DTOs;

public record CourseModuleRequest
{
    public ModuleRequest? Module { get; set; } = null!;
}