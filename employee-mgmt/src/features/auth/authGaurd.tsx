import { Navigate, useLocation } from "react-router-dom";
import { ACCESS_TOKEN_KEY } from "../../utils/constant";
import axios from "axios";
import { environment } from "../../environment/environment.dev";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, useSnackbar } from "../../app/hooks";
import { logout, setReturnUrl, setCredentials } from "./authSlice";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({
  children,
  allowedRoles,
}: Readonly<AuthGuardProps>) {
  const { isAuthenticated, role } = useSelector((state: any) => state.auth);
  const location = useLocation();
  const snackbar = useSnackbar();
  const dispatch = useAppDispatch();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);

      // If no access token exists, try to refresh
      if (!token) {
        try {
          // Attempt refresh using regular axios
          const refreshResponse = await axios.post(
            `${environment.baseUrl}/auth/refresh`,
            null,
            { withCredentials: true }
          );

          const newAccessToken = refreshResponse.data.accessToken;

          // Update Redux state with the new token
          dispatch(
            setCredentials({
              accessToken: newAccessToken,
            })
          );
        } catch (error: any) {
          console.log("refresh fail in guard", error.response.data.Message);
          // Refresh failed, clear auth state
          snackbar.error(error.response.data.Message);
          dispatch(logout());
        }
      }

      setIsValidating(false);
    };

    validateAuth();
  }, [dispatch]);

  // Only run after validation is complete
  useEffect(() => {
    if (!isValidating && !isAuthenticated && location.pathname !== "/login") {
      dispatch(setReturnUrl(location.pathname));
    }
  }, [isValidating, isAuthenticated, location.pathname, dispatch]);

  if (isValidating) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
