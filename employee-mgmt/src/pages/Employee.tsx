import { useEffect } from "react";
import {
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchEmployees } from "../features/employees/empApi";
import type { Employee } from "../features/employees/interfaces/employee.interface";

export default function Employees() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((s: any) => s.employees);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage. Request will likely fail.");
      return;
    }

    console.log("Token found. Dispatching fetchEmployees...");
    dispatch(fetchEmployees());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading employees...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={4}>
        <Typography variant="h4" gutterBottom>
          Employees List
        </Typography>
        <Alert severity="error">Error fetching employees: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box m={4}>
      <Typography variant="h4" gutterBottom>
        Employee List
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="employee table">
          {/* Table Header */}
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Salary
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Joined Date</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {list.map((employee: Employee) => (
              <TableRow
                key={employee.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {employee.id}
                </TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell align="right">
                  Rs.{employee.salary.toLocaleString()} {/* Format salary */}
                </TableCell>
                <TableCell>{employee.departmentName}</TableCell>
                <TableCell>{formatDate(employee.createdOn)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {list.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No employees found.
        </Alert>
      )}
    </Box>
  );
}
