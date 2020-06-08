using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        // Extension method for HttpResponse to add additional application errors to a response
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
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