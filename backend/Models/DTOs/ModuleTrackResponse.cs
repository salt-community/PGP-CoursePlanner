namespace backend.Models.DTOs;

public record ModuleTrackResponse
{
    public int CourseId { get; init; }
    public int ModuleId { get; init; }
    public ModuleResponse? Module { get; init; }

    // Constructor
    public ModuleTrackResponse(CourseModule moduleTrack)
    {
        ModuleId = moduleTrack.ModuleId;
        TrackId = moduleTrack.TrackId;
        Tracks = moduleTrack.Module != null ? new TrackResponse(moduleTrack.Module) : null;
    }

    // Implicit operator
    public static implicit operator ModuleTrackResponse(ModuleTrack courseModule) => new(courseModule);
}