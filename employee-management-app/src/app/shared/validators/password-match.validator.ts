import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    const isMatch = password.value === confirmPassword.value;

    if (!isMatch) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
    } else {
        if (confirmPassword.hasError('passwordMismatch')) {
            confirmPassword.setErrors(null);
        }
        return null;
    }
};


// import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
//     const password = control.get('password');
//     const confirmPassword = control.get('confirmPassword');

//     if (!password || !confirmPassword) return null;

//     const isMatch = password.value === confirmPassword.value;

//     if (!isMatch && !confirmPassword.errors?.['passwordMismatch']) {
//         confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
//     } else if (isMatch && confirmPassword.errors?.['passwordMismatch']) {
//         const { passwordMismatch, ...rest } = confirmPassword.errors;
//         confirmPassword.setErrors(Object.keys(rest).length ? rest : null);
//     }

//     return null;
// };
