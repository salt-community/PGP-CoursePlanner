namespace backend.Models.DTOs;

public record ModuleResponse(Module module)
{
    public int Id { get; init; } = module.Id;
    public string Name { get; init; } = module.Name;
    public int NumberOfDays { get; init; } = module.NumberOfDays;
    public List<DayResponse> Days { get; init; } = module.Days.Select(day => new DayResponse(day)).ToList();
    public List<Track> Tracks { get; init; } = module.Tracks;
    public int Order { get; init; } = module.Order;
    public bool IsApplied { get; init; } = module.IsApplied;
    public DateTime StartDate { get; init; } = module.StartDate;

    public static implicit operator ModuleResponse(Module module) => new(module);
}