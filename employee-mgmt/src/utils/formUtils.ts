import type { FieldError } from "react-hook-form";

export const getErrorMessage = (
    error: FieldError | undefined,
    customMessages: { [key: string]: string } = {}
): string | null => {
    if (!error) return null;

    // specific message 
    if (customMessages[error.type]) {
        return customMessages[error.type];
    }

    // default Standard Messages
    switch (error.type) {
        case 'required':
            return 'This field is required.';

        case 'minLength':
            return error.message || 'Value is too short.';

        case 'maxLength':
            return error.message || 'Value is too long.';

        case 'min':
            return error.message || 'Value is too low.';

        case 'max':
            return error.message || 'Value is too high.';

        case 'email':
        case 'pattern':
            return error.message || 'Invalid format.';

        case 'validate':
            return error.message || 'Invalid value.';

        default:
            return error.message || `Error: ${error.type}`;
    }
};