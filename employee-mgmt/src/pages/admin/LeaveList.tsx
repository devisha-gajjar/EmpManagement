import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector, useDebounce } from "../../app/hooks";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  TablePagination,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { fetchLeavesList } from "../../features/admin/leave/leaveApi";
import { leaveHubService } from "../../services/signalR/leaveHub.service";

export default function LeaveList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const dispatch = useAppDispatch();
  const { leaves, loading, error } = useAppSelector((state) => state.leaveList);

  useEffect(() => {
    // leaveHubService.startConnection().then(() => {
    //   leaveHubService.joinAdmin();
    // });

    dispatch(fetchLeavesList());

    const onNewLeave = (data: any) => {
      console.log("New Leave Arrived:", data);
      dispatch(fetchLeavesList());
    };

    leaveHubService.onNewLeaveRequest(onNewLeave);

    const handleStatusChange = (data: {
      leaveRequestId: number;
      status: string;
    }) => {
      console.log("Leave status updated:", data);
      dispatch(fetchLeavesList());
    };

    leaveHubService.onLeaveStatusChanged(handleStatusChange);

    const handleEdit = (data: any) => {
      console.log("Leave edited:", data);
      dispatch(fetchLeavesList());
    };

    leaveHubService.onEditLeaveRequest(handleEdit);

    const handleLeaveDelete = (data: {
      leaveRequestId: number;
      status: string;
    }) => {
      dispatch(fetchLeavesList());
    };

    leaveHubService.onDeleteLeaveRequest(handleLeaveDelete);

    return () => {
      leaveHubService.offLeaveStatusChanged(handleStatusChange);
      leaveHubService.connection.off("NewLeaveRequest", onNewLeave);
    };
  }, []);

  const filteredLeaves = leaves.filter(
    (leaves: any) =>
      leaves.leaveType
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      leaves.status.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      leaves.user.fullName
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
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
      <Typography color="error" mt={3} align="center">
        Error: {error}
      </Typography>
    );

  const handleApprove = (leaveId: number, userId: number) => {
    leaveHubService.approveLeave({ leaveId, userId });
  };

  const handleDecline = (leaveId: number, userId: number) => {
    leaveHubService.denyLeave({ leaveId, userId });
  };

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Leave Requests
      </Typography>
      <Box mb={2} display="flex" justifyContent="flex-end">
        <input
          type="text"
          placeholder="Search Levaes..."
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

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Leave Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedLeaves.map((leave: any) => (
              <TableRow
                key={leave.leaveRequestId}
                hover
                sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
              >
                <TableCell>
                  <Typography fontWeight={500}>
                    {leave.user.fullName}
                  </Typography>
                </TableCell>

                <TableCell>{leave.leaveType}</TableCell>
                <TableCell>{leave.startDate.split("T")[0]}</TableCell>
                <TableCell>{leave.endDate.split("T")[0]}</TableCell>

                <TableCell>
                  <Chip
                    label={leave.status}
                    color={
                      leave.status === "Approved"
                        ? "success"
                        : leave.status === "Denied"
                        ? "error"
                        : "primary"
                    }
                    variant="outlined"
                    size="small"
                  />
                </TableCell>

                <TableCell>{leave.reason}</TableCell>

                {/* ACTION ICONS */}
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Approve Leave">
                      <span>
                        <IconButton
                          color="success"
                          disabled={leave.status !== "Pending"}
                          onClick={() =>
                            handleApprove(
                              leave.leaveRequestId,
                              leave.user.userId
                            )
                          }
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Reject Leave">
                      <span>
                        <IconButton
                          color="error"
                          disabled={leave.status !== "Pending"}
                          onClick={() =>
                            handleDecline(
                              leave.leaveRequestId,
                              leave.user.userId
                            )
                          }
                        >
                          <CancelIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
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
  );
}
