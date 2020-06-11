using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Get the result of the http context of the action that was executed
            var resultContext = await next();

            // Parse out the userId from the http request based on the token data
            var userId = int.Parse(resultContext.HttpContext.User
                .FindFirst(ClaimTypes.NameIdentifier).Value);

            // Set the result context request service to the IDatingRepository
            var repo = resultContext.HttpContext.RequestServices.GetService<IDatingRepository>();

            // Access the GetUser method in the IDatingRepository and pass in the userId of the person performing a request
            // Gets the user object at the id
            var user = await repo.GetUser(userId);

            // Set the user LastActive prop to the current time
            user.LastActive = DateTime.Now;

            await repo.SaveAll();
        }
    }
}