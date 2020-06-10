import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Declare an output from this component calledd cancelRegister, all outputs are EventEmitters
  @Output() cancelRegister = new EventEmitter();

  // Initialite the component model
  user: User;
  registerForm: FormGroup;

  // BsDatepickerConfig class has a lot of required fields
  // and we only want to change one field in there so we will
  // set it as a partial class
  bsConfig: Partial<BsDatepickerConfig>;
  maxDate: Date;

  // Inject the AuthService
  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private router: Router
    ) { }

  ngOnInit() {
    this.datePickerConfig();
    this.createRegisterForm();
  }

  // Datepicker with configurations
  datePickerConfig() {
    // Theme
    this.bsConfig = {
      containerClass: 'theme-red',
      showWeekNumbers: false
    };

    // Max date allowed for datepicker
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
  }

  // Register form using FormBuilder service
  createRegisterForm() {
    this.registerForm = this.fb.group({
      // Form inputs as properties: property options (form state of '' to display no text in the field, validations for the field)
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  // Register Form custom validator
  passwordMatchValidator(g: FormGroup) {
    // return true of the password and confirmPassword values are equal, if not then return a mismatch
    return g.get('password').value === g.get('confirmPassword').value ? null : {mismatch: true};
  }

  // Logic to register the user
  register() {
    if (this.registerForm.valid) {
      // Assign user object data to the registration form object data
      this.user = Object.assign({}, this.registerForm.value);

      // Send the register command from the auth service
      this.authService.register(this.user).subscribe(() => {
        // If its successful 
        this.alertify.success('Registration successful!');
      }, error => {
        // If it errors
        this.alertify.error(error);
      }, () => {
        // If it is successful, do this after everything
        // Login as the user and navigate to the members page
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
  }

  // Logic to cancel registration and hide the registration inputs
  cancel() {
    // Set the cancelRegister output to emit false
    this.cancelRegister.emit(false);
    console.log('Cancelled');
  }
}
