using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;
        public PhotosController(
             IDatingRepository repo, 
             IMapper mapper, 
             IOptions<CloudinarySettings> cloudinaryConfig)
         {
            _repo = repo;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );
          
            _cloudinary = new Cloudinary(acc);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);
            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            // Check if the user that passed the token is the actual user by the Id
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            // Get the user from the inputted id
            var userFromRepo = await _repo.GetUser(userId);

            // Store the dto file data into a file var
            var file = photoForCreationDto.File;

            // Store the image upload response into a var
            var uploadResult = new ImageUploadResult();

            // If there is actually data in the dto file prop
            if (file.Length > 0)
            {
                // Use a file stream reader
                using (var stream = file.OpenReadStream())
                {
                    // Set upload parameters for Cloudinary
                    var uploadParams = new ImageUploadParams()
                    {
                        // Get file description data from Cloudinary for the file to be uploaded
                        File = new FileDescription(file.Name, stream),
                        // Transform the photo using specific parameters
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    // Upload the photo to cloudninary using the parameters above
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            // Set the photo creation dto url prop to the upload result uri
            photoForCreationDto.Url = uploadResult.Uri.ToString();

            // Set the photo creation dto publicid prop to the upload publicid
            photoForCreationDto.PublicId = uploadResult.PublicId;

            // Map the photo for creation dto to the photo model
            var photo = _mapper.Map<Photo>(photoForCreationDto);

            // If the user has no photos that are set as main (no photos)
            if (!userFromRepo.Photos.Any(u => u.IsMain))
                // Set this photo to be the main photo
                photo.IsMain = true;

            // Add the photo data to the post
            userFromRepo.Photos.Add(photo);         

            // Attempt to save the upload
            if (await _repo.SaveAll())
            {
                // Map the photo to the photo to return dto to modify the return data
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);

                // Return CreatedAtRoute using the GetPhoto route, user id and photo id prop, and the mapped photo to return
                return CreatedAtRoute("GetPhoto", new { userId= userId, id = photo.Id }, photoToReturn);
            }

            // If the upload failed to save
            return BadRequest("Could not add the photo.");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            // Check if the user that passed the token is the actual user by the Id
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            // Get the user data from the passed in userId
            var user = await _repo.GetUser(userId);

            // If the given photoId does not match any of the user's photoId then it does not exist
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            // Get the photo data from the passed in photoId
            var photoFromRepo = await _repo.GetPhoto(id);

            // If the photo is already the main photo
            if (photoFromRepo.IsMain)
                return BadRequest("This photo is already the main photo.");

            // Get main photo data for passed in user
            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);

            // Set the main photo to false
            currentMainPhoto.IsMain = false;

            // Set the new photo selected to be main to main photo
            photoFromRepo.IsMain = true;

            // Attempt to save changes
            if (await _repo.SaveAll())
                return NoContent();

            // If save changes failed
            return BadRequest("Could not set photo to main.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            // Check if the user that passed the token is the actual user by the Id
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            // Get the user data from the passed in userId
            var user = await _repo.GetUser(userId);

            // If the given photoId does not match any of the user's photoId then it does not exist
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            // Get the photo data from the passed in photoId
            var photoFromRepo = await _repo.GetPhoto(id);

            // If the photo is already the main photo prevent deletion
            if (photoFromRepo.IsMain)
                return BadRequest("You cannot delete your main photo.");

            // If there is a publicId for the photo it must also be deleted from the cloudinary storage
            if (photoFromRepo.PublicId != null)
            {
                // Delete the image from cloudinary
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);
                var result = _cloudinary.Destroy(deleteParams);

                // Get the result of the cloudinary destroy to confirm the image was deleted
                if (result.Result == "ok")
                    // Delete the photo refrence from the db
                    _repo.Delete(photoFromRepo);

                // Attempt to save db changes
                if (await _repo.SaveAll())
                    return Ok();
            }

            // If there is no publicId then just delete (no cloudinary)
            if (photoFromRepo.PublicId == null) 
            {
                // Delete the photo refrence from the db
                _repo.Delete(photoFromRepo);

                 // Attempt to save db changes
                if (await _repo.SaveAll())
                    return Ok();
            }

            // If db save fails
            return BadRequest("Failed to delete the photo.");
        }
    }
}