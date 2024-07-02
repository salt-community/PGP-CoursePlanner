namespace Backend.Models
{
    public class CalendarDate
    {
        public int Id { get; set; }
        public DateOnly Date { get; set; }
        public List<DateContent> DateContent { get; set; } = [];
    }
}