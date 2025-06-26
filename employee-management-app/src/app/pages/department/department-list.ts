import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Department } from '../../types/department.model';
import { DepartmentService } from '../../services/department/department.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { Subscription } from 'rxjs';
import { materialImports } from '../../shared/material';


@Component({
  selector: 'app-department-list',
  imports: [
    FormsModule,
    CommonModule,
    ...materialImports
  ],
  templateUrl: './department-list.html',
  styleUrl: './department-list.scss'
})

export class DepartmentListComponent {
  department: Department[] = [];
  totalEmployees = 0;
  totalEmpSubscription?: Subscription;
  departmentSubscription?: Subscription;

  constructor(private departmentService: DepartmentService, private employeeService: EmployeeService) {
    this.loadDepartment();
    this.loadTotalEmployees();
  }

  loadTotalEmployees() {
    this.totalEmpSubscription = this.employeeService.getEmployees().subscribe((employees) => {
      this.totalEmployees = employees.length;
    });
  }

  loadDepartment() {
    this.departmentSubscription = this.departmentService.getDepartments().subscribe((data) => {
      this.department = data;
    });
  }

  ngOnDestroy() {
    this.departmentSubscription?.unsubscribe();
    this.totalEmpSubscription?.unsubscribe();
  }

}
