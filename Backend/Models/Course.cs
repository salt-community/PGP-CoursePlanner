using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Course
    {
        public int Id {get; set; }
        public required string Name {get; set;}
        public int NumberOfWeeks {get; set;}
        public List<int> moduleIds {get; set;} = [];
        [JsonIgnore]
        public List<CourseModule> Modules {get; set;} = [];
    }
}