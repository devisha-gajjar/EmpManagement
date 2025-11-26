import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAppSelector } from "../../app/hooks";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  return isAuth ? children : <Navigate to="/login" />;
}
