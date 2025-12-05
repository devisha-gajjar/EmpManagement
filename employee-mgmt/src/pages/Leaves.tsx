import { useEffect } from "react";
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
} from "@mui/material";
import { fetchLeaves } from "../features/user/leave/leaveApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import type { LeaveRequestResponse } from "../interfaces/leave.interface";

const Leaves = () => {
  const dispatch = useAppDispatch();
  const { leaves, loading, error } = useAppSelector((state) => state.leaves);

  useEffect(() => {
    dispatch(fetchLeaves());
  }, [dispatch]);

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
      {/* Page Header */}
      <Typography variant="h4" mb={3} fontWeight="bold">
        My Leave Requests
      </Typography>

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
                <TableCell>{leave.reason}</TableCell>
                <TableCell>
                  {new Date(leave.createdOn).toLocaleDateString()}
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
