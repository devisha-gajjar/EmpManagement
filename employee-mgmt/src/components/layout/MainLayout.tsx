import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { SnackbarComponent } from "../shared/snackbar/Snackbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <SnackbarComponent />
        <Outlet />
      </main>
    </>
  );
}
