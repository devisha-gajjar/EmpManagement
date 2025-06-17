import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '../src/app/app'
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptor/auth-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
  provideHttpClient(withInterceptors([authInterceptor])),
  provideAnimations(),
  provideToastr()]
}).catch(err => console.error(err));
