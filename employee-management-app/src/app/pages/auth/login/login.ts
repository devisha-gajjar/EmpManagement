import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReusableButtonComponent } from '../../../shared/components/reusable-button/reusable-button';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.loginForm.valid) {
      const credentials = {
        UsernameOrEmail: this.loginForm.value.email,
        Password: this.loginForm.value.password
      }

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log("success", response);
          localStorage.setItem('token', response.token); 
          this.router.navigate(['/app/home']);
        },
        error: (err) => {
          console.log("error", err);

        }
      })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  cancel() {
    this.loginForm.reset();
  }
}
