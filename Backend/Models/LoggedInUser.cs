namespace Backend.Models
{
    public class LoggedInUser
    {
        public int Id { get; set; }
        public required string Refresh_Token {get; set;}
    }
}