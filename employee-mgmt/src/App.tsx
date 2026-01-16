import { useRoutes, Navigate } from "react-router-dom";
import AuthGuard from "./features/auth/authGaurd";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/shared/Login";
import Employees from "./pages/admin/Employee";
import Leaves from "./pages/user/Leaves";
import { Unauthorized } from "./pages/shared/Unauthorized";
import UserDashboard from "./pages/user/UserDashboard";
import { Department } from "./pages/admin/Department";
import Register from "./pages/shared/Register";
import LeaveList from "./pages/admin/LeaveList";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import NotFound from "./pages/shared/NotFound";
import ProjectsPage from "./pages/admin/Project-Mgmt/components/Project";
import ProjectDetails from "./pages/admin/Project-Mgmt/components/ProjectDetails";
import ProjectFormPage from "./pages/admin/Project-Mgmt/components/ProjectForm";
import ProjectMembersPage from "./pages/admin/Project-Mgmt/components/ProjectMember";
import NotificationList from "./pages/user/notification/notification-list";
import UserTask from "./pages/user/user-task/user-task";
import TaskWorkLogsPage from "./pages/admin/Project-Mgmt/components/TaskWorkLogsPage";
import MyProfilePage from "./pages/user/profile/components/MyProfielPage";
import TwoFactorVerify from "./pages/auth/TwoFactorVerify";
import TwoFactorSetup from "./pages/auth/TwoFactorSetup";

function App() {
  const routes = useRoutes([
    // ---------- PUBLIC ROUTES ----------
    { path: "/login", element: <Login /> },
    { path: "/auth/2fa-setup", element: <TwoFactorSetup /> },
    { path: "/auth/2fa", element: <TwoFactorVerify /> },
    { path: "/register", element: <Register /> },
    { path: "/", element: <Navigate to="/login" /> },
    { path: "/unauthorized", element: <Unauthorized /> },
    { path: "*", element: <NotFound /> },

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
        { path: "notification", element: <NotificationList /> },
        { path: "tasks", element: <UserTask /> },
        { path: "profile", element: <MyProfilePage /> },
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
        { path: "leavesList", element: <LeaveList /> },
        { path: "projects", element: <ProjectsPage /> },
        { path: "project-details/:id", element: <ProjectDetails /> },
        { path: "projects/new", element: <ProjectFormPage /> },
        { path: "projects/edit/:id", element: <ProjectFormPage /> },
        { path: "projects/members/:id", element: <ProjectMembersPage /> },
        {
          path: "projects/:projectId/tasks/:taskId/work-logs",
          element: <TaskWorkLogsPage />,
        },
      ],
    },
  ]);

  return <>{routes}</>;
}

export default App;
