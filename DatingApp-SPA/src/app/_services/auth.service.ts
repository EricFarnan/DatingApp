import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

// Create the auth service
export class AuthService {
  // set the url for the service
  baseUrl = 'http://localhost:5000/api/auth/';

  // Inject the HttpClient
  constructor(private http: HttpClient) { }

  // Create login method that takes in a model of any type
  login(model: any) {
    // The model will return the status of sending a post to the url that includes the intake model (user & pass)
    return this.http.post(this.baseUrl + 'login', model)
    // Store the token from the response into the browser's local storage if the response is true (valid user & pass)
      .pipe(
        map((response: any) => {
          // If the response is true
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
          }
        })
      );
  }

  // Register method to post to register with credential data captured in the register conponent model
  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model);
  }
}
