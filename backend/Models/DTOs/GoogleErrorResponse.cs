namespace Backend.Models.DTOs
{
    public class GoogleErrorResponse
    {
        public required string Error { get; set; }
        public required string Error_Description { get; set; }
    }
}