namespace backend.Models
{
    public class CalendarDate
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public List<DateContent> DateContent { get; set; } = [];
    }
}