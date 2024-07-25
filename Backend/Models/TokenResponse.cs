
namespace Backend.Models
{
    public class TokenResponse
    {
        public required string Access_token { get; set; }
        public int Expires_in { get; set; }
        public required string Id_token { get; set; }
        public string? Refresh_token { get; set; }
        public string? Scope {get; set;}
        public string? Token_type { get; set; }
    }
}