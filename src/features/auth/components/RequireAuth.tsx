import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/auth.storage";

export default function RequireAuth() {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}