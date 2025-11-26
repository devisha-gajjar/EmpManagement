import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useAppDispatch, useAppSelector, useSnackbar } from "../app/hooks";
import { updateEmployee, addEmployee } from "../features/employees/empApi";
import type { Employee } from "../interfaces/employee.interface";
import { fetchDepartments } from "../features/department/departmentApi";

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
  const toast = useSnackbar();
  const { departments, loading, error } = useAppSelector(
    (state) => state.department
  );

  // Local Form State
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    salary: number;
    departmentId: number | null;
  }>({
    name: "",
    email: "",
    salary: 0,
    departmentId: null,
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchDepartments()); 
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name,
        email: employeeToEdit.email,
        salary: employeeToEdit.salary,
        departmentId: employeeToEdit.departmentId,
      });
      console.log("formdata ", employeeToEdit.salary);
    } else {
      setFormData({ name: "", email: "", salary: 0, departmentId: null });
    }
  }, [employeeToEdit, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value as string });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill required fields");
      return;
    }

    const payload = {
      ...formData,
      id: employeeToEdit?.id,
      salary: Number(formData.salary),
    };

    try {
      if (employeeToEdit) {
        await dispatch(
          updateEmployee({ id: employeeToEdit.id, data: payload })
        ).unwrap();
        toast.success("Employee updated successfully");
      } else {
        console.log;
        await dispatch(addEmployee(payload)).unwrap();
        toast.success("Employee added successfully");
      }
      onClose();
    } catch (error: any) {
      const errorMessage = error?.Message || "Failed to save employee";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {employeeToEdit ? "Edit Employee" : "Add New Employee"}
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Salary"
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              label="Department"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleSelectChange}
              required
            >
              {loading ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : error ? (
                <MenuItem disabled>{error}</MenuItem>
              ) : (
                departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {employeeToEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
