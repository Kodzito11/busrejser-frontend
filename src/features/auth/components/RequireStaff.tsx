import { Navigate, Outlet } from "react-router-dom";
import { useResolvedSession } from "../hooks/useResolvedSession";

export default function RequireStaff() {
  const { user, loading } = useResolvedSession();

  if (loading) {
    return null;
  }

  const isStaff = user?.role === "Admin" || user?.role === "Medarbejder";

  if (!isStaff) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}