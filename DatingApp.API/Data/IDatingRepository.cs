using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    // DatingRepository interface
    public interface IDatingRepository
    {
        // <T> (T entity / generic type) means that this method will return a specific entity type 'where T: class'
        // Meaning T must be a class
         void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;

         // Task that returns a boolean for saving all
         Task<bool> SaveAll();

         // Task that returns a paged list user to get all users
         Task<PagedList<User>> GetUsers(UserParams userParams);    

         // Task that returns a User
         Task<User> GetUser(int id);
    
         Task<Photo> GetPhoto(int id);
         Task<Photo> GetMainPhotoForUser(int userId);
    }
}