namespace backend.Models.DTOs;

public record ModuleResponse
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public int NumberOfDays { get; init; }
    public List<DayResponse> Days { get; init; } = new();
    public string[] Track { get; init; } = Array.Empty<string>();
    public int Order { get; init; }
    public bool IsApplied { get; init; }
    public DateTime StartDate {get; init;}

    // Constructor
    public ModuleResponse(Module module)
    {
        Id = module.Id;
        Name = module.Name;
        NumberOfDays = module.NumberOfDays;
        Days = module.Days.Select(day => new DayResponse(day)).ToList();
        Track = module.Track;
        Order = module.Order;
        IsApplied = module.IsApplied;
        StartDate = module.StartDate;
    }

    // Implicit operator
    public static implicit operator ModuleResponse(Module module) => new(module);
}