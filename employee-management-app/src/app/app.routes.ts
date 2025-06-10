import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employees/employee-list/employee-list';
import { DepartmentListComponent } from './department/department-list/department-list';
import { AboutComponent } from './about/about-info/about-info';

export const routes: Routes = [
  { path: 'home', component: EmployeeListComponent },
  { path: 'department', component: DepartmentListComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
