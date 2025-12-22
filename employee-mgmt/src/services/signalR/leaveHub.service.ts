import * as signalR from "@microsoft/signalr";
import { environment } from "../../environment/environment.dev";
import type { CreateLeaveRequest } from "../../interfaces/leave.interface";

class LeaveHubService {
    public connection: signalR.HubConnection;
    private connected = false;
    private newLeaveRequestRegistered = false;
    private statusChangeRegistered = false;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(environment.signalRLeaveUrl)
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

    onLeaveStatusChanged(callback: (data: { leaveRequestId: number; status: string }) => void) {
        if (this.statusChangeRegistered) return;
        this.statusChangeRegistered = true;

        console.log("LeaveStatusChanged listener registered");
        this.connection.on("LeaveStatusChanged", callback);
    }

    offLeaveStatusChanged(callback: (data: { leaveRequestId: number; status: string }) => void) {
        this.connection.off("LeaveStatusChanged", callback);
        this.statusChangeRegistered = false;
    }

    onNewLeaveRequest(callback: (data: any) => void) {
        if (this.newLeaveRequestRegistered) return;
        this.newLeaveRequestRegistered = true;

        console.log("NewLeaveRequest listener registered");
        this.connection.on("NewLeaveRequest", callback);
    }

    onEditLeaveRequest(callback: (data: any) => void) {
        this.connection.on("LeaveEdited", callback);
    }

    onDeleteLeaveRequest(callback: (data: { leaveRequestId: number; status: string }) => void) {
        this.connection.on("LeaveDeleted", callback);
    }

    async joinUser(userId: string) {
        await this.waitForConnection();
        await this.connection.invoke("JoinAsUser", userId);
        console.log("User joined SignalR group");
    }

    async joinAdmin() {
        await this.waitForConnection();
        await this.connection.invoke("JoinAsAdmin");
        console.log("Admin joined admin group");
    }

    async applyLeave(payload: CreateLeaveRequest) {
        await this.connection.invoke("ApplyLeave", payload);
    }

    async approveLeave({ leaveId, userId }: { leaveId: number; userId: number }) {
        await this.connection.invoke(
            "ApproveLeave",
            leaveId.toString(),
            userId.toString()
        );
    }

    async denyLeave({ leaveId, userId }: { leaveId: number; userId: number }) {
        await this.connection.invoke(
            "DenyLeave",
            leaveId.toString(),
            userId.toString()
        );
    }

    async editLeave(payload: CreateLeaveRequest) {
        await this.connection.invoke("EditLeave", payload);
    }

    async deleteLeave(leaveId: number, userId: string) {
        await this.connection.invoke(
            "DeleteLeave",
            leaveId.toString(),
            userId
        );
    }
}

export const leaveHubService = new LeaveHubService();
