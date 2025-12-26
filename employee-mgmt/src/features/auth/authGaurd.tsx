import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/hooks";
import { setReturnUrl } from "./authSlice";

interface Props {
  children: any;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: Props) {
  const { isAuthenticated, role } = useSelector((state: any) => state.auth);
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Not logged in -> redirect
  if (!isAuthenticated) {
    dispatch(setReturnUrl(location.pathname));
    return <Navigate to="/login" replace />;
  }

  // Role-based check -> if allowedRoles provided
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
