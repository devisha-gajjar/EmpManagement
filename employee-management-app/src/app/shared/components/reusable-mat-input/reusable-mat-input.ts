import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reusable-mat-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './reusable-mat-input.html',
  styleUrl: './reusable-mat-input.scss',
})
export class ReusableMatInputComponent {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() required = false;
  @Input() control!: FormControl;
  @Input() disabled = false;
  @Input() autocomplete = '';
  @Input() validationMessages: { [key: string]: string } = {};

  inputId = `input-${Math.random().toString(36).slice(2)}`;

  errorKeys(): string[] {
    return this.control && this.control.errors ? Object.keys(this.control.errors) : [];
  }

  getErrorMessage(errorKey: string, errorValue: any): string {
    if (this.validationMessages[errorKey]) {
      return this.validationMessages[errorKey].replace(
        /\{\{(.*?)\}\}/g,
        (_, token) => errorValue[token.trim()] || ''
      );
    }

    const defaultMessages: { [key: string]: string } = {
      required: 'This field is required.',
      minlength: `Minimum length is ${errorValue.requiredLength}.`,
      maxlength: `Maximum length is ${errorValue.requiredLength}.`,
      email: 'Invalid email format.',
    };

    return defaultMessages[errorKey] || 'Invalid field.';
  }
}
