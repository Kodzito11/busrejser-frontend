import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth.storage";

export default function RequireStaffRedirect() {
  const user = getCurrentUser();

  const isStaff =
    user?.role === "Admin" || user?.role === "Medarbejder";

  if (!isStaff) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/admin/busser" replace />;
}