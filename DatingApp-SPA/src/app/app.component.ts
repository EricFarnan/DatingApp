import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService) {}

  // When the application is initialized
  ngOnInit() {
    // Grab the token from local storage (if exists)
    const token = localStorage.getItem('token');
    // If the token exists
    if (token) {
      // set the authService decodedToken value to the decoded token
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
  }
}
