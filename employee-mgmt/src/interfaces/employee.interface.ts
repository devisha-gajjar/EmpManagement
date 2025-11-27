export interface Employee {
    id: number;
    name: string;
    email: string;
    salary: number;
    departmentId: number;
    departmentName: string;
    createdOn: string; // ISO Date string
}

// export interface EmployeesState {
//     list: Employee[];
//     employee: Employee | null;
//     loading: boolean;
//     isDeleted: boolean;
// }

export interface EmployeesState {
    ids: number[];                // Array of employee IDs
    entities: { [id: number]: Employee };  // Object with employee entities by id
    employee: Employee | null;     // For the single selected employee
    loading: boolean;
    isDeleted: boolean;
}