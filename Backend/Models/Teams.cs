namespace Backend.Models
{
    public class Teams
    {
        public int Id {get; set;}
        public string Name {get; set;}
        public List<string> Emails {get; set;} = [];

    }
}