// import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { provideHttpClientTesting } from '@angular/common/http/testing';
// import { of } from 'rxjs';

// import { LoginComponent } from './login';
// import { ReusableMatInputComponent } from '../../../shared/components/reusable-mat-input/reusable-mat-input';
// import { ReusableButtonComponent } from '../../../shared/components/reusable-button/reusable-button';
// import { materialImports } from '../../../shared/material';

// import { AuthService } from '../../../services/auth/auth.service';
// import { ToastrService } from 'ngx-toastr';
// import { CookieService } from 'ngx-cookie-service';
// import { Router, ActivatedRoute } from '@angular/router';

// const meta: Meta<LoginComponent> = {
//     title: 'Auth/Login Form',
//     component: LoginComponent,
//     tags: ['autodocs'],
//     decorators: [
//         moduleMetadata({
//             imports: [
//                 CommonModule,
//                 ReactiveFormsModule,
//                 ReusableMatInputComponent,
//                 ReusableButtonComponent,
//                 ...materialImports,
//             ],
//             providers: [
//                 provideHttpClientTesting(),
//                 //  Mock AuthService
//                 {
//                     provide: AuthService,
//                     useValue: {
//                         login: () => of({ token: 'mock-token' }),
//                         googleLogin: () => of({ token: 'mock-google-token' }),
//                         facebookLogin: () => of({ token: 'mock-fb-token' }),
//                     },
//                 },
//                 //  Mock ToastrService
//                 {
//                     provide: ToastrService,
//                     useValue: {
//                         success: (msg: string) => console.log('Toastr Success:', msg),
//                         error: (msg: string) => console.log('Toastr Error:', msg),
//                     },
//                 },
//                 //  Mock CookieService
//                 {
//                     provide: CookieService,
//                     useValue: {
//                         set: (...args: any[]) => console.log('Cookie set:', args),
//                     },
//                 },
//                 //  Mock Router
//                 {
//                     provide: Router,
//                     useValue: {
//                         navigate: (commands: string[]) => console.log('Mock navigate:', commands),
//                         createUrlTree: (commands: any[]) => commands, //  mock this to prevent crash
//                         serializeUrl: (urlTree: any) => urlTree.join('/'), // Optional for [routerLink] href
//                         events: of({})
//                     },
//                 },
//                 // Mock ActivatedRoute
//                 {
//                     provide: ActivatedRoute,
//                     useValue: {
//                         snapshot: {},
//                         params: of({}),
//                         queryParams: of({}),
//                         data: of({}),
//                     },
//                 },
//             ],
//         }),
//     ],
// };

// export default meta;
// type Story = StoryObj<LoginComponent>;

// export const Default: Story = {
//     parameters: {
//         docs: {
//             description: {
//                 story: 'Empty login form. Submitting without input triggers validation errors.',
//             },
//         },
//     },
// };


import { StoryObj, Meta, moduleMetadata } from '@storybook/angular';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { LoginComponent } from './login';
import { ReusableMatInputComponent } from '../../../shared/components/reusable-mat-input/reusable-mat-input';
import { ReusableButtonComponent } from '../../../shared/components/reusable-button/reusable-button';
import { materialImports } from '../../../shared/material';

import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';

const meta: Meta<LoginComponent> = {
    title: 'Auth/Login Form',
    component: LoginComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                ReusableMatInputComponent,
                ReusableButtonComponent,
                ...materialImports,
            ],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: (data: any) => {
                            console.log('✅ Mock login called with:', data);
                            return of({ token: 'mock-token' });
                        },
                    },
                },
                {
                    provide: ToastrService,
                    useValue: {
                        success: (msg: string) => console.log('Toastr Success:', msg),
                        error: (msg: string) => console.log('Toastr Error:', msg),
                    },
                },
                {
                    provide: CookieService,
                    useValue: {
                        set: (...args: any[]) => console.log('Cookie set:', args),
                    },
                },
                {
                    provide: Router,
                    useValue: {
                        navigate: (commands: string[]) => console.log('Mock navigate:', commands),
                        createUrlTree: (commands: any[]) => commands,
                        serializeUrl: (urlTree: any) => urlTree.join('/'),
                        events: of({}),
                    },
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {},
                        params: of({}),
                        queryParams: of({}),
                        data: of({}),
                    },
                },
            ],
        }),
    ],
};

export default meta;
type Story = StoryObj<LoginComponent>;

export const ValidLogin: Story = {
    name: 'Login with Valid Input',
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const emailInput =  canvas.getByLabelText(/email/i);
        const passwordInput =  canvas.getByLabelText(/password/i);
        const loginButton =  canvas.getByRole('button', { name: /login/i });

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'Test@1234');
        await userEvent.click(loginButton);

        // Assertion (optional)
        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('Test@1234');
    },
};
