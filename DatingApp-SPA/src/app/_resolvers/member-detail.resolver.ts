import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable()
// A resolver is used to pass in specific information about
// something to a route when loading the route
// In this example when the member detail route is hit it will
// resolve the user interface's data
export class MemberDetailResolver implements Resolve<User> {
    constructor(
        private userService: UserService,
        private router: Router,
        private alertify: AlertifyService
        ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        // Route snapshot will return an observable user based on the route parameter id
        // by performing the getUser/id API call
        return this.userService.getUser(route.params.id).pipe(
            // If there is an error getting the user/id data
            catchError(error => {
                // Toast an alert that the data was not able to be retrieved.
                this.alertify.error('Problem retrieving data.');
                // route the user back to members
                this.router.navigate(['/members']);
                // Return observeable type null
                return of(null);
            })
        );
    }
}