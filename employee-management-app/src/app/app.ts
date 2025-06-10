import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../app/services/employee';
import { Employee } from './models/employee.model';
import { NavbarComponent } from './layout/navbar/navbar';
import { FooterComponent } from './layout/footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
  
export class AppComponent {}
