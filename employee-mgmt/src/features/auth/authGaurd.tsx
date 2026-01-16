import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setReturnUrl } from "./authSlice";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: Readonly<Props>) {
  const { isAuthenticated, role } = useSelector((state: any) => state.auth);
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/login") {
      dispatch(setReturnUrl(location.pathname));
    }
  }, [isAuthenticated, location.pathname, dispatch]);

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based authorization
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
