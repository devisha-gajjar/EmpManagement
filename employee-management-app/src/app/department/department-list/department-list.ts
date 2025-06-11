import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { Department } from '../../models/department.model';
import { DepartmentService } from '../../services/department';
import {MatDividerModule} from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCard } from '@angular/material/card';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-department-list',
  imports: [MatDividerModule, MatListModule, FormsModule,CommonModule,MatCard],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css'
})
  
export class DepartmentListComponent {
  department: Department[] = [];
  totalEmployees = 0;

  constructor(private departmentService: DepartmentService, private employeeService: EmployeeService) {
    this.loadDepartment();
    this.loadTotalEmployees();
  }

   loadTotalEmployees() {
    this.employeeService.getEmployees().subscribe((employees) => {
      this.totalEmployees = employees.length;
    });
  }

  loadDepartment() {
    this.departmentService.getDepartments().subscribe((data) => {
      this.department = data;
    });
  }

}
