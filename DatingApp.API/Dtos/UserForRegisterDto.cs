using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    // Data transfer object for user registration
    public class UserForRegisterDto
    {
        // Can add attributes to the properties for validations
        [Required]
        public string Username { get; set; }

        // Additional attributes for property validations 
        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "Password must be between 4 and 8 characters.")]
        public string Password { get; set; }
    }
}