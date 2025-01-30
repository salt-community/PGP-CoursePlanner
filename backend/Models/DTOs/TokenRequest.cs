using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs;

public record TokenRequest
{
    [Required]
    public string Access_token { get; set; } = null!;
}
