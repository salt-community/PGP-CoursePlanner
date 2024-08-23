namespace backend.Models
{
    public class AppliedDay
    {
        public int Id { get; set;}
        public int DayNumber { get; set; }
        public string? Description { get; set; }
        public List<AppliedEvent> Events { get; set; } = [];
    }
}