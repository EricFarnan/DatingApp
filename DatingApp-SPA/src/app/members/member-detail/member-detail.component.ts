import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from 'ngx-gallery-9';

// This component is used for member's page
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  // Create a user property for this component based on the User interface model
  user: User;

  // Image gallery properties
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  // Injections
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  // On component initialization
  ngOnInit() {
    // subscribe to the route data for the user and set the data for the user model
    this.route.data.subscribe((data) => {
      this.user = data.user;
    });

    // Set gallery options and styling
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];

    // Set gallery images
    this.galleryImages = this.getImagesSorted();
  }

  // Retrieve all images for the user
  getImages() {
    const imgUrls = [];
    // For each photo in the user's photos
    for (const photo of this.user.photos) {
      // Add the photo url to the imgUrls array
      imgUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description,
      });
    }
    return imgUrls;
  }

  // Sorts the user's photos by main first and then by upload date descending
  getImagesSorted() {
    const imgUrls = [];

    // Order the photos chronologically descending
    let sortedPhotosObj = this.user.photos.sort((a, b) => {
      return (new Date(b.dateAdded) as any) - (new Date(a.dateAdded) as any);
    });

    // Find the main photo for the user
    const mainPhoto = this.user.photos.find(p => p.isMain === true);

    // Remove the main photo from the sortedPhotosObject
    sortedPhotosObj = sortedPhotosObj.filter((p => p.isMain !== true), 1);

    // Insert the main photo to the first position in the array
    sortedPhotosObj = [mainPhoto].concat(sortedPhotosObj);

    // Add the sorted photo urls to the imgUrls array
    for (const photo of sortedPhotosObj) {
      // Add the photo url to the imgUrls array
      imgUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description,
      });
    }

    return imgUrls;
  }
}
