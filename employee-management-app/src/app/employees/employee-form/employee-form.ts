import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../models/employee.model';
import { Department } from '../../models/department.model';
import { DepartmentService } from '../../services/department';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './employee-form.html',
  styleUrl:'./employee-form.css'
})
  
export class EmployeeFormComponent implements OnInit {
  @Input() employee: Employee | null = null;
  @Input() departments: Department[] = [];
  @Output() saved = new EventEmitter<Employee>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder, private departmentService: DepartmentService) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.employee?.id],
      name: [this.employee?.name || '', Validators.required],
      email: [this.employee?.email || '', [Validators.required, Validators.email]],
      departmentId: [this.employee?.departmentId.toString() || '', Validators.required],
    });

    this.departmentService.getDepartments().subscribe({
      next: (departments) => this.departments = departments,
      
      error: (err) => {
        this.departments = [];
        console.error('Error fetching departments:', err);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.saved.emit(this.form.value);
    }
  }

  cancel() {
    this.cancelled.emit();
  }
}
