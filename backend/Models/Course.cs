using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Course
    {
        public int Id { get; set; }
        [Required]
        public Track Track { get; set; } = null!;
        public string? Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int NumberOfWeeks { get; set; }
        public List<Module> Modules { get; set; } = [];
        public List<int> ModuleIds { get; set; } = [];
        public List<Event> MiscellaneousEvents { get; set; } = [];
        public string? Color { get; set; }
        public bool IsApplied { get; set; } = false;
        [Required]
        public DateTime CreationDate { get; init; } = DateTime.UtcNow;
    }
}