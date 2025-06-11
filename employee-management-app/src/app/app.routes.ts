import { Routes } from '@angular/router';
import { EmployeeListComponent } from './pages/home/employee-list/employee-list';
import { DepartmentListComponent } from './pages/department/department-list';
import { AboutComponent } from './pages/about/about-info';

export const routes: Routes = [
  { path: 'home', component: EmployeeListComponent },
  { path: 'department', component: DepartmentListComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
