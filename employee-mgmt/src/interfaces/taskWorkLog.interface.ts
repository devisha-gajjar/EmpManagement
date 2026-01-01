export interface TaskWorkLog {
    workLogId: number;
    logDate: string;
    hoursSpent: number;
    description?: string;

    userId: number;
    userName: string;

    createdOn?: string;
    updatedOn?: string;
}

export interface TaskWorkLogListResponse {
    taskId: number;
    taskName: string;
    workLogs: TaskWorkLog[];
}
