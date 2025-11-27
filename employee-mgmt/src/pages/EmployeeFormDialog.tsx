import { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Box,
} from "@mui/material";
import { useAppDispatch, useAppSelector, useSnackbar } from "../app/hooks";
import {
  updateEmployee,
  addEmployee,
  fetchEmployees,
} from "../features/employees/empApi";
import { fetchDepartments } from "../features/department/departmentApi";
import type { Employee } from "../interfaces/employee.interface";
import type { DynamicFormField } from "../interfaces/form.interface";
import DynamicFormComponent from "../components/shared/form/CommonForm";

interface Props {
  open: boolean;
  onClose: () => void;
  employeeToEdit: Employee | null;
}

export default function EmployeeFormDialog({
  open,
  onClose,
  employeeToEdit,
}: Props) {
  const dispatch = useAppDispatch();
  const snackbar = useSnackbar();

  const { departments, loading: deptLoading } = useAppSelector(
    (state) => state.department
  );

  useEffect(() => {
    if (open) {
      dispatch(fetchDepartments());
    }
  }, [dispatch, open]);

  const formConfig: DynamicFormField[] = useMemo(
    () => [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        rules: { required: "Name is required" },
      },
      {
        name: "email",
        label: "Email Address",
        type: "text",
        rules: {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        },
      },
      {
        name: "salary",
        label: "Salary",
        type: "number",
        gridClass: "half",
        rules: {
          required: "Salary is required",
          min: { value: 1, message: "Salary must be positive" },
        },
      },
      {
        name: "departmentId",
        label: "Department",
        type: "select",
        gridClass: "half",
        rules: { required: "Department is required" },
        disabled: deptLoading,
        options: departments.map((dept) => ({
          label: dept.name,
          value: dept.id,
        })),
      },
    ],
    [departments, deptLoading]
  );

  const defaultValues = useMemo(() => {
    if (employeeToEdit) {
      return {
        name: employeeToEdit.name,
        email: employeeToEdit.email,
        salary: employeeToEdit.salary,
        departmentId: employeeToEdit.departmentId,
      };
    }
    return { name: "", email: "", salary: "", departmentId: "" };
  }, [employeeToEdit]);

  const handleFormSubmit = async (data: any) => {
    const payload = {
      ...data,
      id: employeeToEdit?.id,
      salary: Number(data.salary),
    };

    try {
      if (employeeToEdit) {
        await dispatch(
          updateEmployee({ id: employeeToEdit.id, data: payload })
        ).unwrap();
        snackbar.success("Employee updated successfully");
      } else {
        await dispatch(addEmployee(payload)).unwrap();
        snackbar.success("Employee added successfully");
      }

      dispatch(fetchEmployees());
      onClose();
    } catch (error: any) {
      const errorMessage = error?.Message || "Failed to save employee";
      snackbar.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {employeeToEdit ? "Edit Employee" : "Add New Employee"}
      </DialogTitle>

      <DialogContent>
        {deptLoading && departments.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DynamicFormComponent
            formConfig={formConfig}
            defaultValues={defaultValues}
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            submitLabel={employeeToEdit ? "Update" : "Create"}
            cancleLabel="Cancel"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
