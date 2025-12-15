import { useEffect } from "react";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  CenteredContainer,
  DashboardCard,
  InfoText,
} from "../../components/dashboard/DashboardCard";
import { ResponsiveCard } from "../../components/dashboard/ResponsiveCard";
import { fetchDashboardData } from "../../features/user/dashboard/dashboardApi";
import type { LeaveRequest } from "../../interfaces/dashboard.interface";
import PageHeader from "../../components/shared/page-header/PageHeader";

export default function UserDashboard() {
  const dispatch = useAppDispatch();
  const { dashboard, loading, error } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <CenteredContainer>
        <CircularProgress thickness={4} size={80} />
      </CenteredContainer>
    );
  }

  if (error) {
    return (
      <CenteredContainer>
        <Typography variant="h6" color="error">
          Something went wrong: {error}
        </Typography>
      </CenteredContainer>
    );
  }

  return (
    <>
      <div className="mb-3">
        <PageHeader
          icon="speedometer2"
          title="My Dashboard"
          subtitle="Overview of your activities and updates"
          theme="purple"
        />
      </div>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "flex-start",
        }}
      >
        {/* Employee Information */}
        <ResponsiveCard>
          <DashboardCard title="Employee Information">
            <InfoText label="Name" value={dashboard?.fullName} />
            <InfoText label="Position" value={dashboard?.position} />
            <InfoText
              label="Start Date"
              value={new Date(
                dashboard?.employmentStartDate
              ).toLocaleDateString()}
            />
            <InfoText
              label="DOB"
              value={new Date(dashboard?.dateOfBirth).toLocaleDateString()}
            />
          </DashboardCard>
        </ResponsiveCard>

        {/* Tasks */}
        <ResponsiveCard>
          <DashboardCard title="Tasks">
            <InfoText
              label="Total Tasks"
              value={dashboard?.totalTasksAssigned}
            />
            <InfoText label="Pending" value={dashboard?.pendingTasks} />
            <InfoText label="Completed" value={dashboard?.completedTasks} />
          </DashboardCard>
        </ResponsiveCard>

        {/* Leave Information */}
        <ResponsiveCard>
          <DashboardCard title="Leave Information">
            <InfoText
              label="Total Leave Days"
              value={dashboard?.totalLeaveDays}
            />
            <InfoText
              label="Present Days"
              value={dashboard?.totalPresentDays}
            />
            <InfoText label="Absent Days" value={dashboard?.totalAbsentDays} />

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={600} mb={1}>
              Recent Leave Requests:
            </Typography>

            {dashboard?.leaveRequests?.length ? (
              dashboard.leaveRequests.map((leave: LeaveRequest, i: number) => (
                <Box
                  key={i}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    background: "#fafafa",
                  }}
                >
                  <Typography variant="body2">
                    <strong>{leave.leaveType}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(leave.startDate).toLocaleDateString()} →{" "}
                    {new Date(leave.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      color:
                        leave.status === "Approved"
                          ? "green"
                          : leave.status === "Rejected"
                          ? "red"
                          : "orange",
                      fontWeight: 600,
                    }}
                  >
                    {leave.status}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No leave requests found.
              </Typography>
            )}
          </DashboardCard>
        </ResponsiveCard>

        {/* Department */}
        <ResponsiveCard>
          <DashboardCard title="Department">
            <InfoText
              label="Department"
              value={dashboard?.department?.departmentName}
            />
            <InfoText
              label="Manager"
              value={dashboard?.department?.managerName}
            />
          </DashboardCard>
        </ResponsiveCard>
      </Box>
    </>
  );
}
