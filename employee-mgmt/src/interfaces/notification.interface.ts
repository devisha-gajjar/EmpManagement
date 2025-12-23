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