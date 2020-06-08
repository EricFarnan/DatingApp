import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})

// Authentication guard that will check if the user is logged in upon performing a route
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService
    ) {}

  // Upon activation it will check if the user is logged in via the auth service
  canActivate(): boolean {
    if (this.authService.loggedIn()) {
      return true;
    }

    // If the user is not logged in then it will display an error message and route the user to home
    this.alertify.error('You must be logged in to view this page.');
    this.router.navigate(['/home']);
    return false;
  }

}
