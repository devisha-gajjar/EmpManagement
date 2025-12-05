
export interface LeaveSlice {
    leaves: any[];
    loading: boolean;
    error: string | null;
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
