using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class AppliedModule
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int NumberOfDays { get; set; }
        public List<AppliedDay> Days { get; set; } = [];
        public int Order { get; set; }
        public string? Track {get; set;}
        
        // [JsonIgnore]
        // public List<CourseModule> CourseModules { get; set; } = new List<CourseModule>();
    }
}
