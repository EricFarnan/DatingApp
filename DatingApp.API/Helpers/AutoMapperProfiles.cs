using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        // Mapper to map classes into a dto
        public AutoMapperProfiles()
        {
            // UserForListDto map
            CreateMap<User, UserForListDto>()
            // The forMember is used to perform some logic on a dto property
                // In this example it will set the photoUrl property in UserForListDto equal
                // to the photo url for the users in their Photos where the photo property IsMain is true
                .ForMember(dest => dest.PhotoUrl, 
                    opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
                // In this example it is going to set the dto Age property 
                // It will map it from the source (User) date of birth and use an extension method for DateTime
                // to calculate the user's age
                .ForMember(dest => dest.Age,
                    opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            // UserForDetailedDto map
            CreateMap<User, UserForDetailedDto>()
                // For the Dto PhotoUrl property
                .ForMember(dest => dest.PhotoUrl, 
                    // Map from the source (User) Photos class property where IsMain is true and get the url property inside of it
                    opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age,
                    opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            // PhotoForDetailedDto map
            CreateMap<Photo, PhotoForDetailedDto>();

            // UserForUpdateDto to User map
            CreateMap<UserForUpdateDto, User>();

            // Photo mappings
            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<Photo, PhotoForReturnDto>();
        }
    }
}