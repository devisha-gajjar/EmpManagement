import { ProjectStatus } from "../../../../enums/enum";
import type { DynamicFormField } from "../../../../interfaces/form.interface";

export const projectFormConfig: DynamicFormField[] = [
    {
        name: "projectName",
        label: "Project Name",
        type: "text",
        placeholder: "Enter project name",
        rules: {
            required: true,
            minLength: 3,
        },
        validationMessages: {
            required: "Project name is required",
            minLength: "Minimum 3 characters required",
        },
    },
    {
        name: "description",
        label: "Description",
        type: "text",
        placeholder: "Describe the project goals and scope",
        rules: {
            required: true,
        },
        validationMessages: {
            required: "Description is required",
        },
    },
    {
        name: "startDate",
        label: "Start Date",
        type: "date",
        gridClass: "half",
        rules: {
            required: true,
        },
        validationMessages: {
            required: "Start date is required",
        },
    },
    {
        name: "endDate",
        label: "End Date",
        type: "date",
        gridClass: "half",
        rules: {
            required: true,
        },
        validationMessages: {
            required: "End date is required",
        },
    },
    {
        name: "status",
        label: "Status",
        type: "select",
        rules: {
            required: true,
        },
        options: Object.keys(ProjectStatus)
            .filter((k) => isNaN(Number(k)))
            .map((key) => ({
                label: key.replace(/([A-Z])/g, " $1").trim(),
                value: ProjectStatus[key as keyof typeof ProjectStatus],
            })),
        validationMessages: {
            required: "Status is required",
        },
    },
];
