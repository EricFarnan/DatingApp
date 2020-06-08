using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    // DatingRepository interface
    public interface IDatingRepository
    {
        // <T> (T entity) means that this methid will take in a specific entity type and set set it to 'where T: class'
        // Meaning T must be a class
         void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;

         // Task for saving all
         Task<bool> SaveAll();

         // Task that takes in User and gets the user
         Task<User> GetUser(int id);

         // Task that takes in IEnumerable user to get all users
         Task<IEnumerable<User>> GetUsers();        
    }
}