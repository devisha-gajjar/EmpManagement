import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { SnackbarComponent } from "../shared/snackbar/Snackbar";
import { useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { leaveHubService } from "../../services/signalR/leaveHub.service";
import { notificationHubService } from "../../services/signalR/notificationHub.service";
import { Box } from "@mui/material";
import GlobalLoader from "../shared/loader/GlobalLoader";

export default function MainLayout() {
  const { userId, role } = useAppSelector((state) => state.auth);
  const mode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    console.log("Auth state:", userId, role);

    if (!role) return;

    console.log("role", role);

    leaveHubService.startConnection().then(() => {
      if (role == "admin") {
        leaveHubService.joinAdmin();
      } else {
        console.log("join ad user in main layout");
        leaveHubService.joinUser(userId!);
      }
    });

    notificationHubService.startConnection().then(() => {
      if (role == "admin") {
        notificationHubService.joinAdmin();
      } else {
        console.log("join ad user in main layout");
        notificationHubService.joinUser(userId!);
      }
    });
  }, [userId, role]);

  return (
    <div style={{ display: "flex", flex: 1, position: "relative" }}>
      <div style={{ position: "relative" }}>
        <Sidebar role={role!} drawerWidth={280} />
      </div>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflowY: "auto",
          background:
            mode == "light"
              ? "linear-gradient(to bottom right, #f5f3ff, #eff6ff, #eef2ff)"
              : "#01132eff",
        }}
      >
        <SnackbarComponent />
        <Navbar />
        <GlobalLoader />
        <Box
          sx={{
            padding: "0.5rem 2rem 2rem 2rem",
          }}
        >
          <Outlet />
        </Box>
      </main>
    </div>
  );
}
