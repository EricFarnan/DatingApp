import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Declare an output from this component calledd cancelRegister, all outputs are EventEmitters
  @Output() cancelRegister = new EventEmitter();

  // Initialite the component model
  model: any = {};

  // Inject the AuthService
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  // Logic to register the user
  // Will use the AuthService register method and pass in the model data
  register() {
    this.authService.register(this.model).subscribe(() => {
      console.log('Registration successful');
    }, error => {
      console.log(error);
    });
  }

  // Logic to cancel registration and hide the registration inputs
  cancel() {
    // Set the cancelRegister output to emit false
    this.cancelRegister.emit(false);
    console.log('Cancelled');
  }
}
