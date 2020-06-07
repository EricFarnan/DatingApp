using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    // Interface that states the methods to be implemented
    // for authentication
    public interface IAuthRepository
    {
         Task<User> Register(User user, string password);
         Task<User> Login(string username, string password);
         Task<bool> UserExists(string username);
    }
}