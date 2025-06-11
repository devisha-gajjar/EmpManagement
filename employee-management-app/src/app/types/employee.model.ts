export interface Employee {
  id: number;
  name: string;
  email: string;
  departmentId: number;
  departmentName?: string;
  salary?: number;
  createdOn?: Date;
}
