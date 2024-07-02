
namespace Backend.Models
{
    public class AppliedCourse
    {
        public int Id { get; set; }
        public DateOnly StartDate { get; set;}
        public int CourseId { get; set; }
    }
}