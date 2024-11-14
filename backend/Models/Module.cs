using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Module
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required string Name { get; set; }
        public int NumberOfDays { get; set; }
        public List<Day> Days { get; set; } = [];
        [JsonIgnore]
        public List<CourseModule> CourseModules { get; set; } = new List<CourseModule>();

        public string[] Track {get; set;} = [];
        public int Order { get; set; }
        public bool IsApplied { get; set; } = false;
    }
}
