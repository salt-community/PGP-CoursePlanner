namespace Backend.Models
{
    public class Day
    {
        public int Id { get; set;}
        public int DayNumber { get; set; }
        public string? Description { get; set; }
        public ICollection<Event> Events { get; set; } = [];
    }
}