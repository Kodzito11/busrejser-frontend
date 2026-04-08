import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth.storage";

export default function RequireStaffRedirect() {
  const user = getCurrentUser();
  const isStaff = user?.role === "Admin" || user?.role === "Medarbejder";

  return <Navigate to={isStaff ? "/admin/busser" : "/"} replace />;
}