export const VALIDATION_MESSAGES = {
    username: {
        required: 'Username is required',
        maxlength: 'Username cannot exceed {{ requiredLength }} characters',
        minlength: 'Username must be at least {{ requiredLength }} characters',
    },
    email: {
        required: 'Email is required',
        email: 'Please enter a valid email address',
    },
    password: {
        required: 'Password is required',
        minlength: 'Password must be at least {{ requiredLength }} characters',
    },
    // add more fields as needed
};


// export const VALIDATION_MESSAGES: {
//     [controlName: string]: { [errorKey: string]: string };
// } = {
//     username: {
//         required: 'Username is required',
//         maxlength: 'Username cannot exceed {{ requiredLength }} characters',
//         minlength: 'Username must be at least {{ requiredLength }} characters',
//     },
//     email: {
//         required: 'Email is required',
//         email: 'Please enter a valid email address',
//     },
//     password: {
//         required: 'Password is required',
//         minlength: 'Password must be at least {{ requiredLength }} characters',
//     },
//     // Add more as needed
// };
