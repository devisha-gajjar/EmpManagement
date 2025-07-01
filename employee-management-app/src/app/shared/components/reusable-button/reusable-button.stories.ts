import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ReusableButtonComponent } from './reusable-button';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export default {
    title: 'Shared/ReusableButton',
    component: ReusableButtonComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, MatButtonModule],
        }),
    ],
    tags: ['autodocs'],
    argTypes: {
        color: {
            control: 'select',
            options: ['primary', 'accent', 'warn'],
        },
        type: {
            control: 'select',
            options: ['button', 'submit', 'reset'],
        },
        disabled: {
            control: 'boolean',
        },
    },
} as Meta<ReusableButtonComponent>;

type Story = StoryObj<ReusableButtonComponent>;

export const Primary: Story = {
    args: {
        color: 'primary',
        type: 'button',
        disabled: false,
    },
    render: (args) => ({
        props: args,
        template: `<app-reusable-button [color]="color" [type]="type" [disabled]="disabled">Primary</app-reusable-button>`,
    }),
};

export const Accent: Story = {
    args: {
        color: 'accent',
        type: 'button',
        disabled: false,
    },
    render: (args) => ({
        props: args,
        template: `<app-reusable-button [color]="color" [type]="type" [disabled]="disabled">Accent</app-reusable-button>`,
    }),
};

export const Warn: Story = {
    args: {
        color: 'warn',
        type: 'button',
        disabled: false,
    },
    render: (args) => ({
        props: args,
        template: `<app-reusable-button [color]="color" [type]="type" [disabled]="disabled">Warn</app-reusable-button>`,
    }),
};

export const Disabled: Story = {
    args: {
        color: 'primary',
        type: 'button',
        disabled: true,
    },
    render: (args) => ({
        props: args,
        template: `<app-reusable-button [color]="color" [type]="type" [disabled]="disabled">Disabled</app-reusable-button>`,
    }),
};

export const SubmitButton: Story = {
    args: {
        color: 'primary',
        type: 'submit',
        disabled: false,
    },
    render: (args) => ({
        props: args,
        template: `<form (ngSubmit)="onSubmit()">
                 <app-reusable-button [color]="color" [type]="type" [disabled]="disabled">Submit</app-reusable-button>
               </form>`,
    }),
};

export const WithClickHandler: Story = {
    args: {
        color: 'primary',
        type: 'button',
        disabled: false,
    },
    render: (args) => ({
        props: {
            ...args,
            onClick: () => alert('Button clicked!'),
        },
        template: `<app-reusable-button [color]="color" [type]="type" [disabled]="disabled" (click)="onClick($event)">Click Me</app-reusable-button>`,
    }),
};
