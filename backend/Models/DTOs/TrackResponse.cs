namespace backend.Models.DTOs;

public record TrackResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Color { get; set; }
    public bool Visibility { get; set; }

    public TrackResponse(Track track)
    {
        Id = track.Id;
        Name = track.Name;
        Color = track.Color;
        Visibility = track.Visibility;
    }

    public static implicit operator TrackResponse(Track track) => new(track);
}