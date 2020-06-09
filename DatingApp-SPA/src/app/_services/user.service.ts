import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})

// User service
export class UserService {
  baseUrl = environment.apiUrl;

  // Inject HttpClient
  constructor(private http: HttpClient) { }

  // Method to return all users from the get users request
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'users');
  }
  // Method to return a specific user from the get users/id request
  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  // Method to update a user
  updateUser(id: number, user: User) {
      return this.http.put(this.baseUrl + 'users/' + id, user);
  }
}
