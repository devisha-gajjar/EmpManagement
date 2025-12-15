import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import {
  deleteLeave,
  fetchLeaves,
  fetchLeaveToEdit,
} from "../../features/user/leave/leaveApi";
import {
  useAppDispatch,
  useAppSelector,
  useDebounce,
  useSnackbar,
} from "../../app/hooks";
import type {
  CreateLeaveRequest,
  LeaveRequestResponse,
} from "../../interfaces/leave.interface";
import { leaveHubService } from "../../services/signalR/leaveHub.service";
import AddLeaveDialog from "./AddLeaveDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonConfirmDialog from "../../components/shared/confirmation-dialog/CommonConfirmDialog";
import PageHeader from "../../components/shared/page-header/PageHeader";

const Leaves = () => {
  const dispatch = useAppDispatch();
  const snackbar = useSnackbar();
  const { leaves, loading, error } = useAppSelector((state) => state.leaves);
  const { userId } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<CreateLeaveRequest | null>(
    null
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // leaveHubService.startConnection().then(() => {
    //   leaveHubService.joinUser(userId!);
    // });

    dispatch(fetchLeaves());

    const handleStatusChange = (data: {
      leaveRequestId: number;
      status: string;
    }) => {
      console.log("Leave status updated:", data);
      dispatch(fetchLeaves());
    };

    leaveHubService.onLeaveStatusChanged(handleStatusChange);

    return () => {
      leaveHubService.offLeaveStatusChanged(handleStatusChange);
    };
  }, []);

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setLeaveToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (leaveToDelete !== null) {
      try {
        leaveHubService.deleteLeave(leaveToDelete, userId!);
        snackbar.success("Leave deleted successfully");
        dispatch(fetchLeaves());
      } catch (err) {
        snackbar.error("Failed to delete leave");
      } finally {
        handleCloseDeleteDialog();
      }
    }
  };

  const handleDeleteClick = (leaveId: number) => {
    setLeaveToDelete(leaveId);
    setIsDeleteDialogOpen(true);
  };

  const handleEditLeave = async (leave: CreateLeaveRequest) => {
    const employeeFetched = await dispatch(
      fetchLeaveToEdit(leave.leaveRequestId)
    ).unwrap();
    setSelectedLeave(employeeFetched);
    setOpen(true);
  };

  const filteredLeaves = leaves.filter(
    (leaves: any) =>
      leaves.leaveType
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      leaves.status.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      leaves.reason.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const paginatedLeaves = filteredLeaves.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" mt={5}>
        {error}
      </Typography>
    );

  return (
    <>
      <Box>
        <div className="mb-3">
          <PageHeader
            icon="calendar-range"
            title="Leave Requests"
            subtitle="View all your leave applications and their status"
            theme="blue"
          />
        </div>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Leave
        </Button>

        <Box mb={2} display="flex" justifyContent="flex-end">
          <input
            type="text"
            placeholder="Search Leave Request..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px",
              width: "250px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </Box>

        <AddLeaveDialog
          open={open}
          onClose={() => setOpen(false)}
          leaveToEdit={selectedLeave}
        />

        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Leave ID
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Leave Type
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Start Date
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  End Date
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Reason
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Created On
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="h6" color="textSecondary">
                      No leave requests added yet
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLeaves.map((leave: LeaveRequestResponse, index) => (
                  <TableRow
                    key={leave.leaveRequestId}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#fff",
                      "&:hover": { backgroundColor: "#e3f2fd" },
                    }}
                  >
                    <TableCell>{leave.leaveRequestId}</TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>
                      {new Date(leave.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(leave.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{leave.status}</TableCell>
                    <TableCell>
                      {leave.reason?.trim() ? leave.reason : "-"}
                    </TableCell>
                    <TableCell>
                      {new Date(leave.createdOn).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {leave.status === "Pending" ? (
                        <>
                          <Tooltip title="Edit Leave">
                            <IconButton
                              color="primary"
                              onClick={() => handleEditLeave(leave)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Leave">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                handleDeleteClick(leave.leaveRequestId)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        "No actions"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredLeaves.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>
      {/* Delete Confirmation Dialog */}
      <CommonConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Leave"
        message="Are you sure you want to delete this Leave?"
        confirmText="Leave"
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default Leaves;
