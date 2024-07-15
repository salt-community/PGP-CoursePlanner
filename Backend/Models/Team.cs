using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Team
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Team name is required.")]
        public required string Name { get; set; }
        public List<string> Emails { get; set; } = [];

    }
}