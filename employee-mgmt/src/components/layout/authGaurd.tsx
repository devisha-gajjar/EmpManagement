import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  children: any;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: Props) {
  const { isAuthenticated, role } = useSelector((state: any) => state.auth);

  // Not logged in -> redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based check -> if allowedRoles provided
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
