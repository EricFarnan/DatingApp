using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    // Inherits the interface for DatingRepository
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;

        // Injection
        public DatingRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            // Match the userId and find the photo that isMain
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        // Method for the http request to get users
        // This will return a pagedlist of user based on user parameters
        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(p => p.Photos).AsQueryable();

            // Remove the user making the request from the response
            users = users.Where(u => u.Id != userParams.UserId);

            // Remove opposite gender from user
            users = users.Where(u => u.Gender == userParams.Gender);

            // Check if the user wants a custom age filter
            if (userParams.minAge != 18 || userParams.maxAge != 99)
            {
                var minDOB = DateTime.Today.AddYears(-userParams.maxAge - 1);
                var maxDOB = DateTime.Today.AddYears(-userParams.minAge);

                users = users.Where(users=> users.DateOfBirth >= minDOB && users.DateOfBirth <= maxDOB);
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}