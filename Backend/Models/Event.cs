
namespace Backend.Models
{
    public class Event
    {
        public int Id { get; set;}
        public required string Name { get; set; }
        public required string StartTime { get; set; }
        public required string EndTime { get; set; }
        public string? Description { get; set; }
    }
}