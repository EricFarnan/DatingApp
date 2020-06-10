using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    // Authentication repository that contains the logic
    // for the methods provided in the IAuthRepository interface
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        // Pull in the datacontext to access the db
        public AuthRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<User> Login(string username, string password)
        {
            // Grab the username from the Users table (if it exists)
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(user => user.Username == username);

            if (user == null)
                return null;

            // Verify the inputted password matches the password stored in the Users table
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;
            
            return user;
        }

        // Verifies the password entered matches the existing password for the user
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                // Compute a hash based on the inputted password
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                // Loop through each byte in computedHash
                for (int index = 0; index < computedHash.Length; index++)
                {
                    // Compare computedHash to passwordHash, if they are not identical
                    // then an incorrect password was entered and return false
                    if (computedHash[index] != passwordHash[index])
                        return false;
                }

                // Return true (passwords match) after each byte between the two
                // hashes have been compared
                return true;
            }  
        }

        // Creates a new user in the Users table
        public async Task<User> Register(User user, string password)
        {
            // Create byte arrays for the hash and salt of the passwords
            byte[] passwordHash, passwordSalt;

            // Method to encrypt the password sent to hash and salt, passed by reference
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            // set the User class password values
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            // Add the new user to the users db table from the users class data
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        // Encrypts the password
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                // Set the values of salt and hash passed by reference
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        // Check if a user exists
        public async Task<bool> UserExists(string username)
        {
            // Grab the user names from the Users table and check if the user exists
            if (await _context.Users.AnyAsync(user => user.Username == username))
                return true;

            return false;
        }
    }
}