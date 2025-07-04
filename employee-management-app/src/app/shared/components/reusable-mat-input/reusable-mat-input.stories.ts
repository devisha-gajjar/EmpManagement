import { Meta, StoryObj } from '@storybook/angular';
import { ReusableMatInputComponent } from './reusable-mat-input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { action } from 'storybook/actions';


const meta: Meta<ReusableMatInputComponent> = {
    title: 'Shared/ReusableMatInput',
    component: ReusableMatInputComponent,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ReusableMatInputComponent>;

// 🔹 Helper to create consistent FormControls
const renderWithControl = (
    control: FormControl,
    label = 'Input',
    type = 'text',
    placeholder = 'Enter value',
    required = false,
    onInput = action('input'),
    onBlur = action('blur')
) => ({
    props: {
        label,
        type,
        placeholder,
        required,
        control,
        input: onInput,
        blur: onBlur,
    },
    moduleMetadata: {
        imports: [
            ReactiveFormsModule,
            MatFormFieldModule,
            MatInputModule],
    },
    template: `
     <div style="padding: 1rem;">
      <app-reusable-mat-input
        [label]="label"
        [type]="type"
        [placeholder]="placeholder"
        [required]="required"
        [control]="control"
        (input)="input($event)"
        (blur)="blur($event)"
      ></app-reusable-mat-input>
    </div>
  `,
});


export const Default: Story = {
    render: () =>
        renderWithControl(new FormControl('Hello World')),
};

export const RequiredError: Story = {
    render: () => {
        const control = new FormControl('', [Validators.required]);
        control.markAsTouched(); // force error to display
        return renderWithControl(control, 'Required Field', 'text', 'Cannot be empty', true);
    },
};

export const MinLengthError: Story = {
    render: () => {
        const control = new FormControl('a', [Validators.minLength(5)]);
        control.markAsTouched();
        return renderWithControl(control, 'Min Length Field', 'text', 'At least 5 chars', true);
    },
};

export const MaxLengthError: Story = {
    render: () => {
        const control = new FormControl('abcdefghij', [Validators.maxLength(5)]);
        control.markAsTouched();
        return renderWithControl(control, 'Max Length Field', 'text', 'Max 5 chars', true);
    },
};

export const EmailFormatError: Story = {
    render: () => {
        const control = new FormControl('invalid-email', [Validators.email]);
        control.markAsTouched();
        return renderWithControl(control, 'Email Field', 'email', 'Enter valid email');
    },
};
