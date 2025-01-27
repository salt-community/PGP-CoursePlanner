namespace backend.Models
{
    public class LoggedInUser
    {
        public int Id { get; set; }
        public required string Refresh_Token { get; set; }
        public required string Access_Token { get; set; }
        public required string Id_token { get; set; }
    }
}