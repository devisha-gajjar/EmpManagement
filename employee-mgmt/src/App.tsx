import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Employees from "./pages/Employee";
import Login from "./pages/Login";
import MainLayout from "./components/layout/MainLayout";
import Register from "./pages/Register";
import { Department } from "./pages/Department";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/employees" element={<Employees />} />
        <Route path="/departments" element={<Department />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<h2>404 - Page Not Found</h2>} />
    </Routes>
  );
}

export default App;
