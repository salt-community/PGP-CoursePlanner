namespace Backend.Models
{
    public class Course
    {
        public int Id {get; set; }
        public required string Name {get; set;}
        public int NumberOfWeeks {get; set;}
        public ICollection<Module> Modules {get; set;} = [];
    }
}