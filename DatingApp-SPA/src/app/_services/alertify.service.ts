import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

// Service class to display alerts to the user
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }

  confirm(message: string, okCallback: () => any) {
    alertify.confirm(message, (e: any) => {
      if (e) {
        okCallback();
      } else {}
    });
  }

  // Success alert
  success(message: string) {
    alertify.success(message);
  }

  // Error alert
  error(message: string) {
    alertify.error(message);
  }

  // Warning alert
  warning(message: string) {
    alertify.warning(message);
  }

  // Message alert
  message(message: string) {
    alertify.message(message);
  }
}
