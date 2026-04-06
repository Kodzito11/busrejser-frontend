import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/auth.storage";

export default function RequireStaff() {
  const user = getCurrentUser();

  const isStaff =
    user?.role === "Admin" || user?.role === "Medarbejder";

  if (!isStaff) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}