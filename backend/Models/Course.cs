using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Course
    {
        public int Id {get; set; }
        public string? Name {get; set;}
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int NumberOfWeeks {get; set;}

        public List<int> moduleIds {get; set;} = [];
        [JsonIgnore]
        public List<CourseModule> Modules {get; set;} = [];
        public string? Color {get; set;}

        public bool IsApplied {get; set;} = false;
    }
}