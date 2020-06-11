using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Helpers
{
    // Generic type T
    public class PagedList<T> : List<T>
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        // Constructor, takes in List of items, count of total items, page number, and page size
        // Used to dynamically set paging
        public PagedList(List<T> items, int totalItemsCount, int PageNumber, int itemsPerPage)
        {
            TotalCount = totalItemsCount;
            PageSize = itemsPerPage;
            CurrentPage = PageNumber;

            // Calculate the total pages needed to display all the items based on the items allower per page
            // Take the total items count and divide it by the items allowed per page, round up
            TotalPages = (int)Math.Ceiling(totalItemsCount / (double)itemsPerPage);

            // Add the items to the PagedList
            this.AddRange(items);
        }

        // Creates a new instance of the class with parameters
        // IQueryable allows us to defer the execution of the request and define parts of the query used in the request
        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int itemsPerPage)
        {
            // Retrieve the item count from the base request
            var count = await source.CountAsync();

            // Retrieve the items from the request 
            // This will skip items and grab the next items in the sequence based on the total allowed items per page

            // Example: We want the second page of the data here and we only allow 5 items per page
            // the pageNumber will be 2, the Skip will take the pageNumber - 1 (value is now 1) and multiply it by the items allowed per page (1 * 5) = 5
            // This means it will skip the first 5 items (or the first page because it contains 5 items)
            // The take will then retrieve the next 5 items

            // Another example: if we want page number 6 and we allow 10 items per page.
            // Taking the pageNumber minus 1 (6 - 1 = 5), and then multiplying it by the total items allowed (5 * 10 = 50)
            // We will be skipping the first 50 items from the response and grabbing the next 10 items
            var items = await source.Skip((pageNumber - 1) * itemsPerPage).Take(itemsPerPage).ToListAsync();

            // Return the new instance of the paged list with the parameters
            return new PagedList<T>(items, count, pageNumber, itemsPerPage);
        }
    }
}