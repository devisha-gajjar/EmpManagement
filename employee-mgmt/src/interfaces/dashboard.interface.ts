export interface DashboardState {
    dashboard: any | null;
    loading: boolean;
    error: string | null;
}

export interface DashboardCardProps {
    title: string;
    children: React.ReactNode;
    loading?: boolean;
}

export interface InfoTextProps {
    label: string;
    value: string | number | null | undefined;
}

export interface CenteredProps {
    children: React.ReactNode;
}

export interface LeaveRequest {
    leaveType: string;
    startDate: string;
    endDate: string;
    status: string;
}
