import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  // Initialize the model object to contain any data
  model: any = {};

  // Inject the auth service and alertify service
  constructor(public authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  // Nav component login method
  login() {
    // Component will interact with the auth service and login using
    // the data inputted from the user that was captured in the model
    this.authService.login(this.model).subscribe(next => {
      // If it was succssful then send an alert of successful
      this.alertify.success('Login successful');
    }, error => {
      // If it failed then display an alert of why it failed
      this.alertify.error(error);
    });
  }

  // Method to check if a user is logged in
  loggedIn() {
    return this.authService.loggedIn();
  }

  // Method to log the user out, will remove the token from local storage
  logout() {
    localStorage.removeItem('token');
    this.alertify.success('Logged out');
  }
}
