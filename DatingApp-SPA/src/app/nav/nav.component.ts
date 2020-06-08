import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  // Initialize the model object to contain any data
  model: any = {};

  // Inject the auth service
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  // Nav component login method
  login() {
    // Component will interact with the auth service and login using
    // the data inputted from the user that was captured in the model
    this.authService.login(this.model).subscribe(next => {
      // If it was succssful then send a console message displaying that it succeeded
      console.log('Logged in successfully');
    }, error => {
      // If it failed then send a console message displaying that it failed
      console.log(error);
    });
  }

  // Method to check if a user is logged in by checking local storage for a token
  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Method to log the user out, will remove the token from local storage
  logout() {
    localStorage.removeItem('token');
    console.log('Logged out');
  }
}
