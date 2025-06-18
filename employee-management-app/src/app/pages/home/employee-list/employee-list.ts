import { Component, ViewChild, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Employee } from '../../../types/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmployeeFormComponent,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss'
})
export class EmployeeListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['name', 'email', 'departmentName', 'salary', 'createdOn', 'actions'];
  dataSource = new MatTableDataSource<Employee>();
  selectedEmployee: Employee | null = null;
  showForm = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loadEmpSubscription?: Subscription;
  deleteEmpSubscription?: Subscription;
  addEmpSubsciption?: Subscription;
  updateEmpSubsciption?: Subscription;

  constructor(private employeeService: EmployeeService) {
    console.log("constructor in emp list");
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEmployees() {
    this.loadEmpSubscription = this.employeeService.getEmployees().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
      this.deleteEmpSubscription = this.employeeService.deleteEmployee(id).subscribe(() => this.loadEmployees());
    }
  }

  onFormSaved(employee: Employee) {
    if (employee.id) {
      this.updateEmpSubsciption = this.employeeService.updateEmployee(employee.id, employee).subscribe({
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
      const { name, email, departmentId, salary } = employee;

      this.addEmpSubsciption = this.employeeService.addEmployee({
        name,
        email,
        departmentId: departmentId.toString(),
        salary: salary ?? 0
      }).subscribe({
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

  ngOnDestroy() {
    console.log("NgOnDestroy in emp list");
    this.loadEmpSubscription?.unsubscribe();
    this.deleteEmpSubscription?.unsubscribe();
    this.addEmpSubsciption?.unsubscribe();
    this.updateEmpSubsciption?.unsubscribe();
  }
}
