import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '../src/app/app'
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptor/auth-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { environment } from '../src/environments/environment';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { importProvidersFrom } from '@angular/core';


bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
  provideHttpClient(withInterceptors([authInterceptor])),
  provideAnimations(),
  provideToastr(),
  importProvidersFrom(SocialLoginModule),
  {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(environment.googleClientId),
        },
      ],
      onError: (err: any) => console.error(err),
    } as SocialAuthServiceConfig,
  }]
}).catch(err => console.error(err));
