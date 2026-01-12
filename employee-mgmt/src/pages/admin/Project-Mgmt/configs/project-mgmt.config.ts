import { ProjectStatus } from "../../../../enums/enum";
import type { TagColor } from "../../../../types/type";

export const ProjectStatusUI: Record<
    ProjectStatus,
    {
        label: string;
        backgroundColor: TagColor;
        textColor: TagColor;
        icon: string;
    }
> = {
    [ProjectStatus.Pending]: {
        label: "Pending",
        backgroundColor: "light-yellow",
        textColor: "yellow",
        icon: "clock",
    },

    [ProjectStatus.Planning]: {
        label: "Planning",
        backgroundColor: "light-purple",
        textColor: "blue",
        icon: "diagram-3",
    },

    [ProjectStatus.InProgress]: {
        label: "In Progress",
        backgroundColor: "light-blue",
        textColor: "blue",
        icon: "arrow-repeat",
    },

    [ProjectStatus.Completed]: {
        label: "Completed",
        backgroundColor: "light-green",
        textColor: "green",
        icon: "check-circle",
    },

    [ProjectStatus.OnHold]: {
        label: "On Hold",
        backgroundColor: "light-orange",
        textColor: "orange",
        icon: "pause-circle",
    },
};

export const projectMock = {
    project_id: 1,
    project_name: "E-Commerce Platform Redesign",
    description:
        "Complete overhaul of the customer-facing e-commerce platform with modern UI/UX",
    start_date: "2025-01-15",
    end_date: "2025-06-30",
    status: "In Progress",
};

export const tasksMock = [
    {
        task_id: 1,
        task_name: "Implement User Authentication",
        description: "Set up OAuth 2.0 authentication with social login",
        priority: "High",
        status: "In Progress",
        assigned_to: "David Kim",
        estimated_hours: 20,
        spent_hours: 7,
        due_date: "2025-02-15",
    },
    {
        task_id: 2,
        task_name: "Database Schema Migration",
        description: "Migrate existing database to new schema",
        priority: "High",
        status: "Ready for Testing",
        assigned_to: "Amanda Foster",
        estimated_hours: 16,
        spent_hours: 10,
        due_date: "2025-02-10",
    },
    {
        task_id: 3,
        task_name: "Design Homepage Wireframes",
        description: "Create wireframes for new homepage",
        priority: "Medium",
        status: "Completed",
        assigned_to: "Michael Chen",
        estimated_hours: 12,
        spent_hours: 12,
        due_date: "2025-02-01",
    },
    {
        task_id: 4,
        task_name: "Design Homepage Wireframes",
        description: "Create wireframes for new homepage",
        priority: "Medium",
        status: "Completed",
        assigned_to: "Michael Chen",
        estimated_hours: 12,
        spent_hours: 12,
        due_date: "2025-02-01",
    },
    {
        task_id: 5,
        task_name: "Design Homepage Wireframes",
        description: "Create wireframes for new homepage",
        priority: "Medium",
        status: "Completed",
        assigned_to: "Michael Chen",
        estimated_hours: 12,
        spent_hours: 12,
        due_date: "2025-02-01",
    },
    {
        task_id: 6,
        task_name: "Design Homepage Wireframes",
        description: "Create wireframes for new homepage",
        priority: "Medium",
        status: "Completed",
        assigned_to: "Michael Chen",
        estimated_hours: 12,
        spent_hours: 12,
        due_date: "2025-02-01",
    },
    {
        task_id: 7,
        task_name: "Design Homepage Wireframes",
        description: "Create wireframes for new homepage",
        priority: "Medium",
        status: "Completed",
        assigned_to: "Michael Chen",
        estimated_hours: 12,
        spent_hours: 12,
        due_date: "2025-02-01",
    },
];
