import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-form-field',
  templateUrl: './reusable-input-controlvalueaccessor.html',
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule],
  styleUrls: ['./reusable-input-controlvalueaccessor.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReusableInputControlvalue),
      multi: true,
    },
  ],
})
export class ReusableInputControlvalue implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() validators: any[] = [];

  formControl = new FormControl('');

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  ngOnInit() {
    if (this.required) {
      this.validators.push(Validators.required);
    }
    this.formControl.setValidators(this.validators);
    if (this.disabled) {
      this.formControl.disable();
    }
  }

  writeValue(value: any): void {
    this.formControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.formControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  onBlur(): void {
    this.onTouched();
  }
}
