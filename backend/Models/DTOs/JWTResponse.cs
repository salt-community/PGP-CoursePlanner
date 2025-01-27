namespace backend.Models.DTOs;

public record JWTResponse
{
    public required string Access_token { get; set; }
    public required string Id_token { get; set; }
    public required int Expires_in { get; set; }
}
