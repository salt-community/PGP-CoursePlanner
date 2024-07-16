
namespace Backend.Models
{
    public class AppliedCourse
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set;}
        public DateTime EndDate { get; set; }
        public int CourseId { get; set; }
        public string? Color { get; set; }
    }
}