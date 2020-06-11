using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        // Extension method for HttpResponse to add additional application errors to a response
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            // This will add error messages to the header of our responses
            response.Headers.Add("Application-Error", message);

            // Must allow application-error in our response headers to avoid CORS error
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        // Extension method for HttpResponse to add pagination to responses
        public static void AddPagination(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            // Initialize a new instance of pagination using the given data
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);

            // Json serialization settings to format serialized object into camelCase
            var camelCaseFormatter = new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();

            // Add the pagination to the response headers by serializing the pagination (sets property names to camel case)
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader, camelCaseFormatter));

            // Allow pagination in our response headers to avoid CORS error
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

        // Extension method for the DateTime class to calculate an age
        public static int CalculateAge(this DateTime theDateTime)
        {
            // Age is equal to the current year minus the year of the datetime provided
            var age = DateTime.Today.Year - theDateTime.Year;

            // Check if birthday has occured by getting the datetime provided + age
            // If the value is greater than the current datetime of today then then set the age - 1
            if (theDateTime.AddYears(age) > DateTime.Today)
                age--;

            return age;
        }
    }
}