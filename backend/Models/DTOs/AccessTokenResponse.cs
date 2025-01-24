namespace backend.Models.DTOs;

public record AccessTokenResponse
{
    public required string Access_token { get; set; }
    public required string Id_token { get; set; }
}
