namespace backend.Models.DTOs;

public record TrackResponse
{
    public int Id { get; init; }
    public string Name { get; init; }
    public string Color { get; init; }
    public bool Visibility { get; init; }

    public TrackResponse(Track track)
    {
        Id = track.Id;
        Name = track.Name;
        Color = track.Color;
        Visibility = track.Visibility;
    }

    public static implicit operator TrackResponse(Track track) => new(track);
}