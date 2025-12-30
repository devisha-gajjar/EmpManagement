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

// project-details-state.interface.ts

export interface ProjectDetailsState {
    project: ProjectDetails | null;
    tasks: ProjectTask[];
    loading: boolean;
    error: string | null;
}

// project-details-response.interface.ts

export interface ProjectDetailsResponse {
    project: ProjectDetails;
    tasks: ProjectTask[];
}


// project-details.interface.ts

export interface ProjectDetails {
    projectId: number;
    projectName: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
}


// project-task.interface.ts

export interface ProjectTask {
    taskId: number;
    taskName: string;
    userId: number;
    projectId: number;
    description: string;
    priority: string;
    status: string;
    assignedTo: string;
    estimatedHours: number;
    spentHours: number;
    dueDate: string;
}
