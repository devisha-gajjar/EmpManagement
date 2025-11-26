export interface DepartmentState {
    departments: { id: number; name: string }[];
    loading: boolean;
    error: string | null;
}