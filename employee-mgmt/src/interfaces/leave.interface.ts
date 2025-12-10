
export interface LeaveSlice {
    leaves: any[];
    loading: boolean;
    error: string | null;
    leaveEdit: any;
    isDeleted: boolean;
}

export interface LeaveRequestResponse {
    leaveRequestId: number;
    userId: number;
    leaveType: string;
    reason: string;
    startDate: string;
    endDate: string;
    status: string;
    createdOn: string;
}

export interface CreateLeaveRequest {
    leaveRequestId: number;
    userId: number;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
}


// admin side

export interface LeaveListSlice {
    leaves: any[];
    loading: boolean;
    error: string | null;
}