import type { ProjectStatus } from "../enums/enum";

export interface Project {
    projectId: number;
    projectName: string;
    description: string;
    status: ProjectStatus;
    startDate: string;
    endDate: string;
    createdOn: string;
    taskCount: number;
    completedTaskCount: number;
    progressPercentage: number;
}

export interface ProjectDetailsState {
    project: Project | null;
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

export interface Task {
    task_id: number;
    task_name: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    status: string;
    assigned_to: string;
    estimated_hours: number;
    spent_hours: number;
    due_date: string;
}
