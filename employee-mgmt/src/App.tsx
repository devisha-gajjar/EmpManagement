import { useRoutes, Navigate } from "react-router-dom";
import AuthGuard from "./components/layout/authGaurd";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Employees from "./pages/Employee";
import { Department } from "./pages/Department";
import { Unauthorized } from "./pages/Unauthorized";
import UserDashboard from "./pages/UserDashboard";
import Leaves from "./pages/Leaves";

function App() {
  const routes = useRoutes([
    // ---------- PUBLIC ROUTES ----------
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/", element: <Navigate to="/login" /> },
    { path: "/unauthorized", element: <Unauthorized /> },

    // ---------- USER ROUTES ----------
    {
      path: "/user",
      element: (
        <AuthGuard allowedRoles={["user"]}>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        { path: "dashboard", element: <UserDashboard /> },
        { path: "leaves", element: <Leaves /> },
      ],
    },

    // ---------- ADMIN ROUTES ----------
    {
      path: "/admin",
      element: (
        <AuthGuard allowedRoles={["admin"]}>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        { path: "employees", element: <Employees /> },
        { path: "departments", element: <Department /> },
      ],
    },
  ]);

  return <>{routes}</>;
}

export default App;
