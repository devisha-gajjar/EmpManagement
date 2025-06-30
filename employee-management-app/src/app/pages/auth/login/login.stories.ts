// import { Meta, moduleMetadata, Story } from '@storybook/angular';
// import { LoginComponent } from './login';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ReusableMatInputComponent } from '../../../shared/components/reusable-mat-input/reusable-mat-input';
// import { ReusableButtonComponent } from '../../../shared/components/reusable-button/reusable-button';
// import { materialImports } from '../../../shared/material';

// export default {
//     title: 'Pages/Login',
//     component: LoginComponent,
//     decorators: [
//         moduleMetadata({
//             declarations: [],
//             imports: [
//                 CommonModule,
//                 ReactiveFormsModule,
//                 RouterTestingModule,
//                 ReusableMatInputComponent,
//                 ReusableButtonComponent,
//                 ...materialImports
//             ],
//             providers: [
//                 {
//                     provide: 'AuthService',
//                     useValue: {
//                         login: () => ({ subscribe: () => { } }),
//                         googleLogin: () => ({ subscribe: () => { } }),
//                         facebookLogin: () => ({ subscribe: () => { } }),
//                     }
//                 },
//                 {
//                     provide: 'ToastrService',
//                     useValue: {
//                         success: console.log,
//                         error: console.error,
//                     }
//                 },
//                 {
//                     provide: 'CookieService',
//                     useValue: {
//                         set: () => { },
//                     }
//                 }
//             ]
//         })
//     ],
//     tags: ['autodocs'],
// } as Meta<LoginComponent>;

// const Template: Story = (args) => ({
//     props: args,
// });

// export const Default = Template.bind({});
// Default.args = {};
