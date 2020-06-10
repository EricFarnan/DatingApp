import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  // Used to edit a child element from the html
  @ViewChild('editForm', {static: true}) editForm: NgForm;

  user: User;
  photoUrl: string;

  // Browser listener to trigger an event before window is edited
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateUser() {
    // Use the user service the update the user based on the token id of the user, pass in the data of the user
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      // Perform this if the update user succeeded
      this.alertify.success('Profile updated successfully!');
      // Reset the form to untouched after updating, repopulates using the user data
      this.editForm.reset(this.user);
    }, error => {
      // Perform this if there was an error updating the user
      this.alertify.error(error);
    });
  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }
}
