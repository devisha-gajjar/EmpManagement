import * as signalR from "@microsoft/signalr";
import { environment } from "../../environment/environment.dev";

class LeaveHubService {
    private connection: signalR.HubConnection;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(environment.signalRUrl) // should include /leaveHub
            .withAutomaticReconnect()
            .build();

        this.startConnection();
    }

    private async startConnection() {
        try {
            await this.connection.start();
            console.log("LeaveHub connected");
        } catch (err) {
            console.error("SignalR Connection Error: ", err);
            setTimeout(() => this.startConnection(), 3000);
        }
    }

    onLeaveStatusChanged(callback: (data: { leaveRequestId: number; status: string }) => void) {
        this.connection.on("LeaveStatusChanged", callback);
    }

    offLeaveStatusChanged(callback: (data: { leaveRequestId: number; status: string }) => void) {
        this.connection.off("LeaveStatusChanged", callback);
    }

    async joinUser(userId: string) {
        await this.connection.invoke("JoinAsUser", userId);
    }
}

export const leaveHubService = new LeaveHubService();
