import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable()
// Resolver used to retrieve the data of Users
// Will return an array of the users
export class MemberListResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 5;

    constructor(
        private userService: UserService,
        private router: Router,
        private alertify: AlertifyService
        ) {}

    // Resolve the route, return an obeserable User interface array
    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        // Populate the return data with the getUsers API call
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
            // Catch errors and perform actions
            catchError(error => {
                this.alertify.error('Problem retrieving data.');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
