import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { SnackbarComponent } from "../shared/snackbar/Snackbar";
import { useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { leaveHubService } from "../../services/signalR/leaveHub.service";

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
  }, [userId, role]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar role={role!} drawerWidth={240} />
        <main
          style={{
            flex: 1,
            padding: "1rem",
            overflowY: "auto",
            marginTop: "64px",
          }}
        >
          <SnackbarComponent />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
