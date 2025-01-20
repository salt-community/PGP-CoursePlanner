namespace backend.Models.DTOs;

public record ModuleTrackResponse
{
    public int ModuleId { get; init; }
    public int TrackId { get; init; }
    public TrackResponse? Track { get; init; }

    // Constructor
    public ModuleTrackResponse(ModuleTrack moduleTrack)
    {
        ModuleId = moduleTrack.ModuleId;
        TrackId = moduleTrack.TrackId;
        Track = moduleTrack.Track != null ? new TrackResponse(moduleTrack.Track) : null;
    }

    // Implicit operator
    public static implicit operator ModuleTrackResponse(ModuleTrack moduleTrack) => new(moduleTrack);
}