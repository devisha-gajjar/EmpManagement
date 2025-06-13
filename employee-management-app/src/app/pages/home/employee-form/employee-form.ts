import { Component, Input, Output, OnInit, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../../types/employee.model';
import { Department } from '../../../types/department.model';
import { DepartmentService } from '../../../services/department/department.service';

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
  styleUrl: './employee-form.scss'
})

export class EmployeeFormComponent implements OnInit {
  @Input() employee: Employee | null = null;
  @Output() saved = new EventEmitter<Employee>();
  @Output() cancelled = new EventEmitter<void>();

  // saved = output<Employee>();
  // cancelled = output<void>();

  getDepartmentSubscription: any;

  form!: FormGroup;
  departments: Department[] = [];

  constructor(private fb: FormBuilder, private departmentService: DepartmentService) { }

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.employee?.id],
      name: [this.employee?.name || '', Validators.required],
      email: [this.employee?.email || '', [Validators.required, Validators.email]],
      departmentId: [this.employee?.departmentId.toString() || '', Validators.required],
    });

    this.getDepartmentSubscription = this.departmentService.getDepartments().subscribe({
      next: (departments) => this.departments = departments,

      error: (err) => {
        this.departments = [];
        console.error('Error fetching departments:', err);
      }
    });
  }

  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  onSubmit() {
    if (this.form.valid) {
      this.saved.emit(this.form.value);
    }
  }

  cancel() {
    this.cancelled.emit();
  }

  ngOnDestroy() {
    this.getDepartmentSubscription?.unsubscribe();
  }

}
