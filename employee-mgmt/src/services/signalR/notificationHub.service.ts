import * as signalR from "@microsoft/signalr";
import { environment } from "../../environment/environment.dev";
import type { ProjectRole } from "../../enums/enum";
import { ACCESS_TOKEN_KEY } from "../../utils/constant";

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
        callback: (data: {
            action: "Added" | "Updated";
            projectId: number;
            userId: number;
            role: ProjectRole;
        }) => void
    ) {
        this.connection.on("ProjectMemberChanged", callback);
    }

    offProjectMemberChanged(callback: Function) {
        this.connection.off("ProjectMemberChanged", callback as any);
    }

    onAssignedToProject(
        callback: (data: {
            projectId: number;
            role: ProjectRole;
            action: "Assigned" | "Updated";
        }) => void
    ) {
        console.log("membeer assigned to one project")
        this.connection.on("AssignedToProject", callback);
    }

    offAssignedToProject(callback: Function) {
        this.connection.off("AssignedToProject", callback as any);
    }

    onTaskAssigned(
        callback: (data: {
            taskId: number;
            taskName: string;
            projectId: number;
            status: string;
            priority: string;
            action: "Assigned" | "Updated";
        }) => void
    ) {
        this.connection.on("TaskAssigned", callback);
    }

    offTaskAssigned(callback: Function) {
        this.connection.off("TaskAssigned", callback as any);
    }

    onNotificationMarkedAsRead(callback: (notification: any) => void) {
        this.connection.on("NotificationMarkedAsRead", callback);
    }

    onUnreadCountUpdated(callback: (count: number) => void) {
        this.connection.on("UnreadNotificationCountUpdated", callback);
    }

    offNotificationMarkedAsRead(callback: Function) {
        this.connection.off("NotificationMarkedAsRead", callback as any);
    }

    offUnreadCountUpdated(callback: Function) {
        this.connection.off("UnreadNotificationCountUpdated", callback as any);
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