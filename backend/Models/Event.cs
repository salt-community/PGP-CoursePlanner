using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Event
    {
        public int Id { get; set;}
        public required string Name { get; set; }
        public required string StartTime { get; set; }
        public required string EndTime { get; set; }
        public string? Description { get; set; }
        [JsonIgnore]
        public List<DateContent>? DateContents { get; set; }
    }
}