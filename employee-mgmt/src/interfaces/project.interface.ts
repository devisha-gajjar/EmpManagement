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
