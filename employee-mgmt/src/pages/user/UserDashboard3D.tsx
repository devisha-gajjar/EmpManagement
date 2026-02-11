// pages/UserDashboard3D.tsx
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchDashboardData } from "../../features/user/dashboard/dashboardApi";
import Dashboard3D from "./Dashboard3D";

export default function UserDashboard3D() {
  const dispatch = useAppDispatch();
  const { dashboard, loading, error } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <Dashboard3D dashboard={dashboard} />;
}
