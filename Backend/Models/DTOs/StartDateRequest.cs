
namespace Backend.Models.DTOs
{
    public class StartDateRequest
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set;}
        public int CourseId { get; set; }
    }
}