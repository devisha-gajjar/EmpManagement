import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
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
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { fetchLeavesList } from "../../features/admin/leave/leaveApi";

export default function LeaveList() {
  const dispatch = useAppDispatch();
  const { leaves, loading, error } = useAppSelector((state) => state.leaveList);

  useEffect(() => {
    dispatch(fetchLeavesList());
  }, [dispatch]);

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

  // Dummy handlers
  const handleApprove = (id: number) => console.log("Approved:", id);
  const handleDecline = (id: number) => console.log("Declined:", id);

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Leave Requests
      </Typography>

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
            {leaves.map((leave: any) => (
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
                        : leave.status === "Rejected"
                        ? "error"
                        : "warning"
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
                          onClick={() => handleApprove(leave.leaveRequestId)}
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
                          onClick={() => handleDecline(leave.leaveRequestId)}
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
    </Box>
  );
}
