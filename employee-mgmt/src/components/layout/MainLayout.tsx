import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { SnackbarComponent } from "../shared/snackbar/Snackbar";
import { useAppSelector, useGlobalCommands } from "../../app/hooks";
import { useEffect, useState } from "react";
import { leaveHubService } from "../../services/signalR/leaveHub.service";
import { notificationHubService } from "../../services/signalR/notificationHub.service";
import { Box } from "@mui/material";
import GlobalLoader from "../shared/loader/GlobalLoader";
import { getBrowserLocation } from "../../services/location/geoLocation.service";
import { sendCoordinatesToBE } from "../../features/user/profile/locationApi";
import CommandPalette from "../search/CommandPalette";

export default function MainLayout() {
  const { userId, role } = useAppSelector((state) => state.auth);
  const mode = useAppSelector((state) => state.theme.mode);

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const commands = useGlobalCommands();

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

  useEffect(() => {
    (async () => {
      try {
        const location = await getBrowserLocation();

        await sendCoordinatesToBE({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        console.log("Coordinates sent to backend");
      } catch (err) {
        console.error("Location permission denied or failed", err);
      }
    })();
  }, []);

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
        <Navbar onOpenSearch={() => setIsPaletteOpen(true)} />
        <CommandPalette
          open={isPaletteOpen}
          onOpen={() => setIsPaletteOpen(true)}
          onClose={() => setIsPaletteOpen(false)}
          commands={commands}
        />
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
