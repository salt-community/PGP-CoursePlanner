namespace backend.Models.DTOs;

public record TrackResponse(Track track)
{
    public int Id { get; set; } = track.Id;
    public string Name { get; set; } = track.Name;
    public string Color { get; set; } = track.Color;
    public bool Visibility { get; set; } = track.Visibility;

    public static implicit operator TrackResponse(Track track) => new(track);
}