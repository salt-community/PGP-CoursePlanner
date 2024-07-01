namespace Backend.Models
{
    public class CalendarDate
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public List<DateContent> DateContent { get; set; } = [];
    }

    public class DateContent
    {
        public int Id { get; set; }
        public string? ModuleName { get; set; }
        public int DayOfModule { get; set; }
        public int TotalDaysInModule { get; set; }
        public required string CourseName { get; set; }
        public List<Event> Events { get; set; } = [];
    }
}