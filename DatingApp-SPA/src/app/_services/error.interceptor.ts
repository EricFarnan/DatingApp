import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Register a new interceptor for catching errors globally
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
      // This is used to intercept http responses and check for any errors
      // If there are errors (that we specify) then it will throw the respected error
    req: import('@angular/common/http').HttpRequest<any>,
    next: import('@angular/common/http').HttpHandler
  ): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {
    return next.handle(req).pipe(
        // Catch errors
        catchError(error => {
            // Unauthorized (401) error
            if (error.status === 401) {
                return throwError(error.statusText);
            }
            // Other error responses besides unauthorized
            if (error instanceof HttpErrorResponse) {
                // Internal server error (500), this will catch any errors that are thrown in the API
                // The error information is found in the response header 'Application-Error'
                const applicationError = error.headers.get('Application-Error');
                // If there is an application error header with data then use that data for the exception
                if (applicationError) {
                    return throwError(applicationError);
                }

                // This will catch any errors from the response that are not API application errors
                // Store any errors occuring from the response due to validations or requirements
                const serverError = error.error;
                // Create a variable to store our error text
                let modalStateErrors = '';
                // Check that the errors being returned are not empty and the type of the errors are in an object
                if (serverError.errors && typeof serverError.errors === 'object') {
                    // Loop through each error type (Password error, Username error, etc.)
                    for (const key in serverError.errors) {
                        // The key here represents the text of what the error type is
                        // If it is not empty
                        if (serverError.errors[key]) {
                            // Add the error text to the modal state errors
                            modalStateErrors += serverError.errors[key] + '\n';
                        }
                    }
                }
                // Return the modalStateErrors if exist, if not return serverError, if that doesn't exist then just display 'Server Error'
                return throwError(modalStateErrors || serverError || 'Server Error');
            }
        })
    );
  }
}

// Register a new interceptor provider that will use our error interceptor class
// This is used in the app.module.ts under the providers section
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
