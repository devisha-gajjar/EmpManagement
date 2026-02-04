import type { TaskPriority, TaskStatus } from "../enums/enum";

export interface UserTasksState {
    tasks: TaskResponseDto[];
    selectedTask: TaskDetailResponseDto | null;
    loading: boolean;
    error: string | null;
}

/* =========================
   TASK LIST
========================= */
export interface TaskResponseDto {
    taskId: number;
    taskName: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    description?: string;
    projectName: string;
}

/* =========================
   TASK DETAIL ROOT
========================= */
export interface TaskDetailResponseDto {
    task: TaskHeaderDto;
    stats: TaskStatsDto;
    tags: TaskTagDto[];
    timeline: TaskTimelineDto[];
    workLogs: TaskWorkLogDto[];
    comments: TaskCommentDto[];
    attachments: TaskAttachmentDto[];
}

/* =========================
   TASK HEADER
========================= */
export interface TaskHeaderDto {
    taskId: number;
    taskName: string;
    description?: string;
    status?: string;
    priority?: string;
    startDate?: string;
    dueDate?: string;
    projectId: number;
    assignedTo?: number;
    assignedBy?: number;
    estimatedHours?: number;
    spentHours: number;
    completedOn?: string;
}

/* =========================
   TASK STATS
========================= */
export interface TaskStatsDto {
    estimatedHours: number;
    totalLoggedHours: number;
}

/* =========================
   TIMELINE
========================= */
export interface TaskTimelineDto {
    userName: any;
    activityId: number;
    action: string;
    oldValue?: string;
    newValue?: string;
    userId: number;
    createdOn: string;
}

/* =========================
   COMMENTS
========================= */
export interface TaskCommentDto {
    commentId: number;
    createdBy: number;
    comment: string;
    createdOn: string;
}

/* =========================
   WORK LOGS
========================= */
export interface TaskWorkLogDto {
    workLogId: number;
    userId: number;
    userName: string;
    hoursSpent: number;
    logDate: string;
    description?: string;
    createdOn: string;
}

/* =========================
   ATTACHMENTS
========================= */
export interface TaskAttachmentDto {
    attachmentId: number;
    fileUrl: string;
    uploadedBy: number;
    uploadedOn: string;
}

/* =========================
   TAGS
========================= */
export interface TaskTagDto {
    tagId: number;
    name: string;
}
