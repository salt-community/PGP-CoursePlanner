using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class AppliedModule
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required string Name { get; set; }
        public int NumberOfDays { get; set; }
        public List<AppliedDay> Days { get; set; } = [];
        public int Order { get; set; }
        public string[]? Track { get; set; }
    }
}
