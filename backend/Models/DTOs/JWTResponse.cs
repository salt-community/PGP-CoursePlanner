namespace backend.Models.DTOs;

public record JWTResponse
{
    public string Access_token { get; set; }
    public string Id_token { get; set; }
    public int Expires_in { get; set; }

    public JWTResponse(TokenResponse tokenResponse)
    {
        Access_token = tokenResponse.Access_token;
        Id_token = tokenResponse.Id_token;
        Expires_in = tokenResponse.Expires_in;
    }

    public static implicit operator JWTResponse(TokenResponse tokenResponse) => new(tokenResponse);
}
