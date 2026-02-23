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
        placeholder: "Enter first name"
    },
    {
        label: "Last Name",
        name: "lastName",
        type: "text",
        gridClass: "half",
        rules: { required: true },
        validationMessages: { required: "Last name is required" },
        placeholder: "Enter last name"
    },
    {
        label: "Username",
        name: "username",
        type: "text",
        rules: { required: true },
        validationMessages: { required: "Username is required" },
        placeholder: "Enter user name"
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
        placeholder: "Enter email address"
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
        placeholder: "Enter password"
    },
    {
        label: "Confirm Password",
        name: "confirmPassword",
        type: "password",
        rules: { required: true },
        validationMessages: {
            required: "Confirm password is required",
        },
        placeholder: "Confirm password"
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
        placeholder: "Enter Phone number"
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
        placeholder: "Enter zipcode"
    },
    {
        label: "Address",
        name: "address",
        type: "text",
        placeholder: "Enter address"
    },
];