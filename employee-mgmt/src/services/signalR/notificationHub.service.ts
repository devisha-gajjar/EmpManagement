import * as signalR from "@microsoft/signalr";
import { environment } from "../../environment/environment.dev";
import type { ProjectRole } from "../../enums/enum";
import { ACCESS_TOKEN_KEY } from "../../utils/constant";
import type { AssignedToProjectPayload, NotificationPayload, ProjectMemberChangedPayload, TaskAssignedPayload } from "../../interfaces/notification.interface";

class NotificationHubService {
    public connection: signalR.HubConnection;
    private connected = false;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(environment.signalRNotificationUrl, {
                accessTokenFactory: () => localStorage.getItem(ACCESS_TOKEN_KEY) ?? ""
            })
            .withAutomaticReconnect()
            .build();
    }

    async startConnection() {
        if (this.connected) return;

        try {
            await this.connection.start();
            this.connected = true;
            console.log("LeaveHub connected");
        } catch (err) {
            console.error("SignalR Connection Error: ", err);
            setTimeout(() => this.startConnection(), 3000);
        }
    }

    private async waitForConnection(timeout = 5000) {
        const start = Date.now();
        while (!this.connected) {
            if (Date.now() - start > timeout) {
                throw new Error("SignalR connection timeout");
            }
            await new Promise((res) => setTimeout(res, 100));
        }
    }

    onProjectMemberChanged(
        callback: (data: ProjectMemberChangedPayload) => void
    ) {
        this.connection.on("ProjectMemberChanged", callback);
    }

    offProjectMemberChanged(
        callback: (data: ProjectMemberChangedPayload) => void
    ) {
        this.connection.off("ProjectMemberChanged", callback);
    }

    onAssignedToProject(
        callback: (data: AssignedToProjectPayload) => void
    ) {
        this.connection.on("AssignedToProject", callback);
    }

    offAssignedToProject(
        callback: (data: AssignedToProjectPayload) => void
    ) {
        this.connection.off("AssignedToProject", callback);
    }

    onTaskAssigned(
        callback: (data: TaskAssignedPayload) => void
    ) {
        this.connection.on("TaskAssigned", callback);
    }

    offTaskAssigned(
        callback: (data: TaskAssignedPayload) => void
    ) {
        this.connection.off("TaskAssigned", callback);
    }

    onNotificationMarkedAsRead(
        callback: (notification: NotificationPayload) => void
    ) {
        this.connection.on("NotificationMarkedAsRead", callback);
    }

    offNotificationMarkedAsRead(
        callback: (notification: NotificationPayload) => void
    ) {
        this.connection.off("NotificationMarkedAsRead", callback);
    }

    onUnreadCountUpdated(
        callback: (count: number) => void
    ) {
        this.connection.on("UnreadNotificationCountUpdated", callback);
    }

    offUnreadCountUpdated(
        callback: (count: number) => void
    ) {
        this.connection.off("UnreadNotificationCountUpdated", callback);
    }

    async joinUser(userId: string) {
        await this.waitForConnection();
        await this.connection.invoke("JoinAsUser", userId);
        console.log("User joined SignalR group in notification");
    }

    async joinAdmin() {
        await this.waitForConnection();
        await this.connection.invoke("JoinAsAdmin");
        console.log("Admin joined admin group in notification");
    }

    async addOrUpdateProjectMember(payload: {
        projectMemberId?: number;
        projectId: number;
        userId: number;
        role: ProjectRole;
    }) {
        await this.waitForConnection();
        await this.connection.invoke("AddOrUpdateProjectMember", payload);
    }

    async addOrUpdateTask(payload: {
        taskId?: number;
        projectId: number;
        userId?: number;
        taskName: string;
        description?: string;
        startDate: string;
        dueDate: string;
        priority?: string;
        status?: string;
        estimatedHours?: number;
    }) {
        await this.waitForConnection();
        await this.connection.invoke("AddOrUpdateTask", payload);
    }

    async markNotificationAsRead(notificationId: number) {
        await this.waitForConnection();
        await this.connection.invoke("MarkNotificationAsRead", notificationId);
    }

    async markAllNotificationsAsRead(notificationIds?: number[] | null) {
        await this.waitForConnection();
        await this.connection.invoke(
            "MarkAllNotificationsAsRead",
            notificationIds ?? null
        );
    }

}

export const notificationHubService = new NotificationHubService();