import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { SnackbarComponent } from "../shared/snackbar/Snackbar";
import { useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { leaveHubService } from "../../services/signalR/leaveHub.service";
import { notificationHubService } from "../../services/signalR/notificationHub.service";

export default function MainLayout() {
  const { userId, role } = useAppSelector((state) => state.auth);

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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar role={role!} drawerWidth={280} />
        <main
          style={{
            flex: 1,
            padding: "2rem",
            overflowY: "auto",
            background:
              "linear-gradient(to bottom right, #f5f3ff, #eff6ff, #eef2ff)",
          }}
        >
          <SnackbarComponent />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
