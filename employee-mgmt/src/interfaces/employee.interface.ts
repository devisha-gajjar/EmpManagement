export interface Employee {
    id: number;
    name: string;
    email: string;
    salary: number;
    departmentId: number;
    departmentName: string;
    createdOn: string; // ISO Date string
}

export interface EmployeesState {
    list: Employee[];
    employee: Employee | null;
    loading: boolean;
    isDeleted: boolean;
}