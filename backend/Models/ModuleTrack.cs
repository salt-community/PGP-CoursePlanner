namespace backend.Models;

public class ModuleTrack
{
    public int ModuleId { get; set; }
    public Module? Module { get; set; }

    public int TrackId { get; set; }
    public Track? Track { get; set; }
}
