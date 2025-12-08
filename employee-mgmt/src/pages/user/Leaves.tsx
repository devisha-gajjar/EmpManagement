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
} from "@mui/material";
import { fetchLeaves } from "../../features/user/leave/leaveApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { LeaveRequestResponse } from "../../interfaces/leave.interface";
import { leaveHubService } from "../../services/signalR/leaveHub.service";
import AddLeaveDialog from "./AddLeaveDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Leaves = () => {
  const dispatch = useAppDispatch();
  const { leaves, loading, error } = useAppSelector((state) => state.leaves);
  const { userId } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLeaves());

    leaveHubService.joinUser(userId!);

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
  }, [dispatch, userId]);

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
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          My Leave Requests
        </Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Leave
        </Button>
      </Box>

      <AddLeaveDialog open={open} onClose={() => setOpen(false)} />

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
            {leaves.map((leave: LeaveRequestResponse, index) => (
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
                          // onClick={() => handleEditEmployee(employee)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Leave">
                        <IconButton
                          color="primary"
                          // onClick={() => handleDeleteClick(employee.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    ""
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Leaves;
