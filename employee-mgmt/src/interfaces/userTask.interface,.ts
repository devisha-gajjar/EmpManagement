import type { TaskPriority, TaskStatus } from "../enums/enum";

export interface TaskResponseDto {
    description: any;
    taskId: number;
    taskName: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string; // ISO string from backend
    projectName: string;
}
