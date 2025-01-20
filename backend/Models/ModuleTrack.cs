namespace backend.Models;

public class ModuleTrack
{
    public int ModuleId { get; set; }
    public Module Module { get; set; } = null!;

    public int TrackId { get; set; }
    public Track Track { get; set; } = null!;
}
