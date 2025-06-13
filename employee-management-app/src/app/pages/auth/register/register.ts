import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ReusableButtonComponent } from '../../../shared/components/reusable-button/reusable-button';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReusableButtonComponent,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
  
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(255)]],
      last_name: [''],
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$')  // At least 1 uppercase letter and 1 number
      ]],
      confirmPassword: ['', [Validators.required]],
      phone: [''],
      address: [''],
      zipcode: [''],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  submit() {
    if (this.registerForm.valid) {
      console.log('Register Data:', this.registerForm.value);
      // Your registration logic here
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  cancel() {
    this.registerForm.reset();
  }

  // Getters for cleaner template access
  get firstName() {
    return this.registerForm.get('first_name');
  }

  get lastName() {
    return this.registerForm.get('last_name');
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get address() {
    return this.registerForm.get('address');
  }

  get zipcode() {
    return this.registerForm.get('zipcode');
  }
}
