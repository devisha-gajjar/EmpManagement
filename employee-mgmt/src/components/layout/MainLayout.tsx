import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { SnackbarComponent } from "../shared/snackbar/Snackbar";
import { useAppSelector } from "../../app/hooks";

export default function MainLayout() {
  const { role } = useAppSelector((state) => state.auth);

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
