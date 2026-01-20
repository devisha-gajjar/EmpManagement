import type { DynamicFormField } from "../../../interfaces/form.interface";
import { emailRegex, phoneRegex } from "../../../utils/constant";

export const RegisterFormFields: DynamicFormField[] = [
    {
        label: "First Name",
        name: "firstName",
        type: "text",
        gridClass: "half",
        rules: { required: true },
        validationMessages: { required: "First name is required" },
    },
    {
        label: "Last Name",
        name: "lastName",
        type: "text",
        gridClass: "half",
        rules: { required: true },
        validationMessages: { required: "Last name is required" },
    },
    {
        label: "Username",
        name: "username",
        type: "text",
        rules: { required: true },
        validationMessages: { required: "Username is required" },
    },
    {
        label: "Email",
        name: "email",
        type: "email",
        rules: {
            required: true,
            pattern: emailRegex,
        },
        validationMessages: {
            required: "Email is required",
            pattern: "Invalid email address",
        },
    },
    {
        label: "Password",
        name: "password",
        type: "password",
        rules: {
            required: true,
            minLength: 8,
        },
        validationMessages: {
            required: "Password is required",
            minLength: "Minimum 8 characters",
        },
    },
    {
        label: "Confirm Password",
        name: "confirmPassword",
        type: "password",
        rules: { required: true },
        validationMessages: {
            required: "Confirm password is required",
        },
    },
    {
        label: "Phone",
        name: "phone",
        type: "phone",
        gridClass: "half",
        rules: { pattern: phoneRegex },
        validationMessages: {
            pattern: "Invalid phone number",
        },
    },
    {
        label: "Zipcode",
        name: "zipcode",
        type: "text",
        gridClass: "half",
        rules: {
            minLength: 6,
            maxLength: 6,
        },
        validationMessages: {
            minLength: "Zipcode must be 6 digits",
            maxLength: "Zipcode must be 6 digits",
        },
    },
    {
        label: "Address",
        name: "address",
        type: "text",
    },
];