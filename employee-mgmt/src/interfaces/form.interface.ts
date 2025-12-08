import type { RegisterOptions, SubmitHandler } from "react-hook-form";

export interface DynamicFormField {
    name: string;
    label: string;
    type: "text" | "password" | "email" | "number" | "select" | "date";
    placeholder?: string;
    rules?: RegisterOptions; // React Hook Form rules (required, min, pattern, etc.)
    options?: { value: string | number; label: string }[]; // For Select inputs
    validationMessages?: { [key: string]: string }; // Custom error messages
    gridClass?: string; // e.g., 'half' or 'full'
    disabled?: boolean;
}

export interface FormProp {
    formConfig: DynamicFormField[];
    onSubmit: SubmitHandler<any>;
    onCancel: () => void;
    defaultValues?: any;
    submitLabel?: string;
    cancleLabel?: string;
    loading?: boolean;
}