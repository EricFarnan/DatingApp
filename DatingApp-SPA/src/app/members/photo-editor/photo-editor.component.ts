import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
    ) { }

  ngOnInit() {
    this.initalizeUploader();
  }

  // FileUploader method
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  // Initialize the photo uploader with user's photos
  initalizeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    // Perform options after uploading file
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    // Perform options after upload succeeds
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response){
        // Extract data from the photo upload response
        const res: Photo = JSON.parse(response);

        // Set a photo object with the new photo
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };

        // Push the uploaded photo object to photos
        this.photos.push(photo);
      }
    };
  }

  // Set main photo
  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
      // Get the current main photo and set it to isMain false
      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain = false;
      // Get the photo being set to main to isMain true
      photo.isMain = true;

      // Update the output to include the photo url
      this.authService.changeMemberPhoto(photo.url);
      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    }, error => {
      this.alertify.error(error);
    });
  }

  deletePhoto(id: number) {
    // Confirmation alert if user wishes to delete photo
    this.alertify.confirm('Are you sure you want to delete this photo?', () => {
      // Delete photo from callback (if user confirms)
      this.userService.deletePhoto(this.authService.decodedToken.nameid, id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
        this.alertify.success('Photo has been deleted.');
      },
        // If callback fails
         error => {
          this.alertify.error('Failed to delete the photo.');
      });
    });
  }
}
