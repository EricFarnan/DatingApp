namespace DatingApp.API.Helpers
{
    // Parameters for user pagination
    public class UserParams
    {
        // Max items per page will be 50
        private const int MaxPageSize = 50;

        // Initialize the page number to 1 unless otherwise requested
        public int PageNumber { get; set; } = 1;
        private int pageSize = 12;

        // Property-full (customizable property) to disallow user from requesting page size higher than MaxPageSize
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }     

        public int UserId { get; set; }
        public string Gender { get; set; }
        public int minAge { get; set; } = 18;
        public int maxAge { get; set; } = 99;
        public string OrderBy { get; set; }
    }
}