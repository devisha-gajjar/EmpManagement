import type { ProjectRole } from "../enums/enum";

export interface NotificationList {
    notificationId: number;
    userId: number;
    title: string;
    message: string;
    type: string;
    referenceId: number;
    isRead: boolean;
    createdAt: string;
}

export interface ProjectMemberChangedPayload {
    action: "Added" | "Updated";
    projectId: number;
    userId: number;
    role: ProjectRole;
}

export interface AssignedToProjectPayload {
    projectId: number;
    role: ProjectRole;
    action: "Assigned" | "Updated";
}

export interface TaskAssignedPayload {
    taskId: number;
    taskName: string;
    projectId: number;
    status: string;
    priority: string;
    action: "Assigned" | "Updated";
}

export interface NotificationPayload {
    notificationId: number;
    isRead: boolean;
}
