
namespace Backend.Models
{
    public class Module
    {
        public required string Name { get; set; }
        public int NumberOfDays { get; set; }
        public ICollection<Day> Days { get; set; } = [];

    }
}