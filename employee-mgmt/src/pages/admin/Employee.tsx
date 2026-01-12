import { useEffect, useState } from "react";
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
  Button,
  IconButton,
  Tooltip,
  TablePagination,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useAppDispatch,
  useAppSelector,
  useDebounce,
  useSnackbar,
} from "../../app/hooks";
// import {
//   fetchEmployees,
//   getEmployee,
//   deleteEmployee,
// } from "../features/employees/empApi";
import type { Employee } from "../../interfaces/employee.interface";
import EmployeeFormDialog from "./EmployeeFormDialog";
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from "../../features/admin/employees/empApi";
import CommonConfirmDialog from "../../components/shared/confirmation-dialog/CommonConfirmDialog";
import PageHeader from "../../components/shared/page-header/PageHeader";

export default function Employees() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);

  // searching and pagination

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const dispatch = useAppDispatch();
  const snackbar = useSnackbar();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  // const { entities, loading, error } = useAppSelector(
  //   (state: any) => state.employees
  // );
  // const employees = Object.values(entities as Record<number, Employee>);

  const { data: employeesData, isLoading, isError } = useGetEmployeesQuery();
  const employees = employeesData || [];

  const [deleteEmployee] = useDeleteEmployeeMutation();

  useEffect(() => {
    console.log("Search Term:", searchTerm);
    console.log("Debounced Search Term:", debouncedSearchTerm);
  }, [searchTerm, debouncedSearchTerm]);

  useEffect(() => {
    if (!isAuthenticated) {
      snackbar.error("Unauthorized Access!!");
    }
    // dispatch(fetchEmployees());
  }, [dispatch, isAuthenticated]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = async (employee: Employee) => {
    // const employeeFetched = await dispatch(getEmployee(employee.id)).unwrap();
    setSelectedEmployee(employee);
    // setSelectedEmployee(employeeFetched);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (employeeId: number) => {
    setEmployeeToDelete(employeeId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete !== null) {
      try {
        // await dispatch(deleteEmployee(employeeToDelete)).unwrap();
        await deleteEmployee(employeeToDelete).unwrap();
        snackbar.success("Employee deleted successfully");
        // dispatch(fetchEmployees());
      } catch (err) {
        snackbar.error("Failed to delete employee");
      } finally {
        handleCloseDeleteDialog();
      }
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const filteredEmployees = employees.filter(
    (emp: Employee) =>
      emp.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      emp.departmentName
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // if (loading && !isDeleteDialogOpen) {
  if (isLoading && !isDeleteDialogOpen) {
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

  if (isError) {
    return (
      <Box m={4}>
        <Alert severity="error">Error fetching employees</Alert>
      </Box>
    );
  }

  // if (error) {
  //   return (
  //     <Box m={4}>
  //       <Alert severity="error">Error fetching employees: {error}</Alert>
  //     </Box>
  //   );
  // }

  return (
    <Box>
      <div className="mb-3">
        <PageHeader
          icon="people"
          title="Employee Management"
          subtitle="Manage your workforce and employee information"
          theme="blue"
        />
      </div>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddEmployee}
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        })}
      >
        Add Employee
      </Button>

      <Box mb={2} display="flex" justifyContent="flex-end">
        <TextField
          size="small"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: 260,
          }}
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="employee table">
          <TableHead
            sx={(theme) => ({
              backgroundColor: theme.palette.background.default,
            })}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Salary
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Joined Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedEmployees.map((employee: Employee) => (
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
                  Rs.{employee.salary.toLocaleString()}
                </TableCell>
                <TableCell>{employee.departmentName}</TableCell>
                <TableCell>{formatDate(employee.createdOn)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit Employee">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditEmployee(employee)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Employee">
                    <IconButton
                      color="primary"
                      onClick={() => handleDeleteClick(employee.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredEmployees.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {employees.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No employees found.
        </Alert>
      )}

      <EmployeeFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        employeeToEdit={selectedEmployee}
      />

      {/* Delete Confirmation Dialog */}
      <CommonConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Employee"
        message="Are you sure you want to delete this employee?"
        confirmText="Delete"
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
