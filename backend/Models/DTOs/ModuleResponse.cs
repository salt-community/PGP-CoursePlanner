namespace backend.Models.DTOs;

public record ModuleResponse
{
    public int Id { get; init; }
    public string Name { get; init; }
    public int NumberOfDays { get; init; }
    public List<DayResponse> Days { get; init; }
    public List<TrackResponse> Tracks { get; init; }
    public int Order { get; init; }
    public bool IsApplied { get; init; }
    public DateTime StartDate { get; init; }

    public ModuleResponse(Module module)
    {
        Id = module.Id;
        Name = module.Name;
        NumberOfDays = module.NumberOfDays;
        Days = module.Days.Select(day => new DayResponse(day)).ToList();
        Tracks = module.Tracks.Select(track => new TrackResponse(track)).ToList();
        Order = module.Order;
        IsApplied = module.IsApplied;
        StartDate = module.StartDate;
    }

    public static implicit operator ModuleResponse(Module module) => new(module);
}