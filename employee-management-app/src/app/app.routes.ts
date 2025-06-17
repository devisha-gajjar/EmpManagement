import { Routes } from '@angular/router';
import { EmployeeListComponent } from './pages/home/employee-list/employee-list';
import { DepartmentListComponent } from './pages/department/department-list';
import { AboutComponent } from './pages/about/about-info';
import { LoginComponent } from './pages/auth/login/login';
import { RegisterComponent } from './pages/auth/register/register';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout';
import { authGuard } from '../app/gaurds/auth-guard'; // 👈 Import your guard

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: 'home', component: EmployeeListComponent },
      { path: 'department', component: DepartmentListComponent },
      { path: 'about', component: AboutComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
