import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee';
import { Employee } from '../../models/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmployeeFormComponent,
    MatTableModule,
    MatButtonModule],
  templateUrl: "employee-list.html",
  styleUrl:"employee-list.css"
})
  
export class EmployeeListComponent {
  displayedColumns = ['name', 'email', 'departmentName', 'actions'];
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  showForm = false;

  constructor(private employeeService: EmployeeService) {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
    });
  }

  onAdd() {
    this.selectedEmployee = null;
    this.showForm = true;
  }

  onEdit(emp: Employee) {
    this.selectedEmployee = emp;
    this.showForm = true;
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => this.loadEmployees());
    }
  }

  onFormSaved(employee: Employee) {
    if (employee.id) {
      this.employeeService.updateEmployee(employee.id, employee).subscribe({
        next: () => {
          this.showForm = false;
          this.loadEmployees();
          alert('Employee updated successfully!!');
        },
        error: (err) => {
          alert(err.error || 'An error occurred while updating!!');
        }
      });
    } else {
      const { name, email, departmentId } = employee;
      this.employeeService.addEmployee({ name, email, departmentId: departmentId.toString() }).subscribe({
        next: () => {
          this.showForm = false;
          this.loadEmployees();
          alert('Employee added successfully!!');
        },
        error: (err) => {
          alert(err.error || 'An error occurred while adding!!');
        }
      });
    }
  }

  onFormCancelled() {
    this.showForm = false;
  }
}
