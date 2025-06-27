import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, Validators } from '@angular/forms';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reusable-mat-input',
  templateUrl: './reusable-mat-input.html',
  styleUrls: ['./reusable-mat-input.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule
  ]
})
export class ReusableMatInputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() autocomplete: string = '';
  @Input() formControl?: FormControl;

  value: any = '';
  disabled = false;

  onChange = (_: any) => { };
  onTouched = () => { };

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    // You can add extra initialization if needed
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any) {
    const value = event.target.value;
    this.value = value;
    this.onChange(value);
  }

  onBlur() {
    this.onTouched();
    if (this.ngControl?.control) {
      this.ngControl.control.markAsTouched();
    }
  }


  // Helper to check if control has errors and has been touched or dirty
  get showError(): boolean {
    console.log('Invalid:', this.ngControl?.invalid);
    console.log('Touched:', this.ngControl?.touched);
    console.log('Dirty:', this.ngControl?.dirty);
    console.log('Errors:', this.ngControl?.errors);
    return !!this.ngControl?.invalid && (!!this.ngControl?.touched || !!this.ngControl?.dirty);
  }




  get errorMessage(): string | null {
    if (!this.ngControl || !this.ngControl.errors) return null;
    const errors = this.ngControl.errors;

    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength}`;
    // Add more error messages as needed

    return null;
  }
}
