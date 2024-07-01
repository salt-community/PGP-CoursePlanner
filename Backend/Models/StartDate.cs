namespace Backend.Models
{
    public class StartDate
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public List<Course> Courses { get; set; } = [];
    }
}