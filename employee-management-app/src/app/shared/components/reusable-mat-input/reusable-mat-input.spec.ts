import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { ReusableMatInputComponent } from './reusable-mat-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ReusableMatInputComponent', () => {
  let component: ReusableMatInputComponent;
  let fixture: ComponentFixture<ReusableMatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule, // to avoid animation errors
        ReusableMatInputComponent, // standalone component import
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReusableMatInputComponent);
    component = fixture.componentInstance;

    // Setup a control for testing
    component.control = new FormControl('', [Validators.required, Validators.email]);
    component.label = 'Email';
    component.placeholder = 'Enter email';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and placeholder correctly', () => {
    const label = fixture.nativeElement.querySelector('mat-label');
    const input = fixture.nativeElement.querySelector('input');

    expect(label.textContent).toContain('Email');
    expect(input.placeholder).toBe('Enter email');
  });

  it('should show required error when control is touched and empty', () => {
    component.control.markAsTouched();
    component.control.setValue('');
    fixture.detectChanges();

    const errorMsg = fixture.nativeElement.querySelector('mat-error div');
    expect(errorMsg.textContent).toContain('This field is required.');
  });

  it('should show email error when control value is invalid email', () => {
    component.control.markAsTouched();
    component.control.setValue('invalid-email');
    fixture.detectChanges();

    const errorMsg = fixture.nativeElement.querySelector('mat-error div');
    expect(errorMsg.textContent).toContain('Invalid email format.');
  });

  it('should not show error when control is valid', () => {
    component.control.markAsTouched();
    component.control.setValue('test@example.com');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('mat-error');
    expect(error).toBeNull();
  });
});
