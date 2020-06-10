import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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
  registerForm: FormGroup;

  // Inject the AuthService
  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  // Register form using FormBuilder service
  createRegisterForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  // Register Form custom validator
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {mismatch: true};
  }

  // Logic to register the user
  // Will use the AuthService register method and pass in the model data
  register() {
    // this.authService.register(this.model).subscribe(() => {
    //   this.alertify.success('Registration successful');
    // }, error => {
    //   this.alertify.error(error);
    // });

    console.log(this.registerForm.value);
  }

  // Logic to cancel registration and hide the registration inputs
  cancel() {
    // Set the cancelRegister output to emit false
    this.cancelRegister.emit(false);
    console.log('Cancelled');
  }
}
