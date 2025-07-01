import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReusableButtonComponent } from '../../../shared/components/reusable-button/reusable-button';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { materialImports } from '../../../shared/material';
import { ReusableMatInputComponent } from '../../../shared/components/reusable-mat-input/reusable-mat-input';
import { VALIDATION_MESSAGES } from '../../../config/validation-messages';

declare const google: any;
declare const FB: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReusableButtonComponent,
    RouterModule,
    ReusableMatInputComponent,
    ...materialImports
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent implements OnInit {
  hidePassword = true;
  loginForm!: FormGroup;
  validationMessages = VALIDATION_MESSAGES;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      console.log("if account id")
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => {
          this.handleGoogleResponse(response);
          console.log("response" + response);

        },
        ux_mode: 'popup'
      });

      google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large' }
      );
    } else {
      console.error('Google Identity Services SDK not loaded.');
    }
  }

  handleGoogleResponse(response: any) {
    const idToken = response.credential;

    this.authService.googleLogin({ idToken }).subscribe({
      next: (res) => {
        this.cookieService.set('token', res.token);
        this.toastr.success('Google login successful');
        this.router.navigate(['/app/home']);
      },
      error: () => {
        this.toastr.error('Google login failed');
      }
    });
  }

  loginWithFacebook() {
    FB.login((response: any) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;

        this.authService.facebookLogin({ accessToken }).subscribe({
          next: (res) => {
            this.cookieService.set('token', res.token);
            this.toastr.success('Facebook login successful');
            this.router.navigate(['/app/home']);
          },
          error: () => {
            this.toastr.error('Facebook login failed');
          }
        });
      } else {
        this.toastr.error('Facebook login cancelled or failed');
      }
    }, { scope: 'email,public_profile' });
  }

  submit() {
    if (this.loginForm.valid) {
      const credentials = {
        UsernameOrEmail: this.loginForm.value.email,
        Password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          const expireDate = new Date();
          expireDate.setHours(expireDate.getHours() + 1);
          this.cookieService.set('token', response.token, expireDate, '/', '', true, 'Strict');

          this.toastr.success('Login successful!', 'Success');
          this.router.navigate(['/app/home']);
        },
        error: (err) => {
          this.toastr.error('Login Failed!', 'Error');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  cancel() {
    this.loginForm.reset();
  }

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
}


