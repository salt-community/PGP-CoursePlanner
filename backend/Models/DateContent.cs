using System.Text.Json.Serialization;

namespace backend.Models
{
    public class DateContent
    {
        public int Id { get; set; }
        public string? ModuleName { get; set; }
        public int DayOfModule { get; set; }
        public int TotalDaysInModule { get; set; }
        public required string CourseName { get; set; }
        public List<Event> Events { get; set; } = [];
        public string? Color { get; set; }
        public int appliedCourseId { get; set;}
        
    }
}