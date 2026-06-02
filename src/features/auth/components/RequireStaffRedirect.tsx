import { Navigate } from "react-router-dom";
import { useResolvedSession } from "../hooks/useResolvedSession";

export default function RequireStaffRedirect() {
  const { user, loading } = useResolvedSession();
  const isStaff = user?.role === "Admin" || user?.role === "Medarbejder";

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={isStaff ? "/admin/busser" : "/kunde"} replace />;
}
