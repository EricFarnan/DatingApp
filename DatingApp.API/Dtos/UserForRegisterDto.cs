using System;
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

        [Required]
        public string Gender { get; set; } 

        [Required]
        public string KnownAs { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Country { get; set; }
        
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }

        public UserForRegisterDto()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}