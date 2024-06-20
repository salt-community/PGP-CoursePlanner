namespace Backend.Models
{
    public class Module
    {
        public int Id { get; set;}
        public required string Name { get; set; }
        public int NumberOfDays { get; set; }
        public ICollection<Day> Days { get; set; } = [];

    }
}