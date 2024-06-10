
namespace Backend.Models
{
    public class Module
    {
        public required string Name { get; set; }
        public int NumberOfDays { get; set; }
        public ICollection<Day> Days { get; set; } = [];

    }

    public class Day
    {
        public int DayNumber { get; set;}
        public string? Description { get; set; }
        public ICollection<Event> Events { get; set; } = [];
    }

    public class Event
    {
        
    }
}