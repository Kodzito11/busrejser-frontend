import { Navigate, Outlet } from "react-router-dom";
import { useResolvedSession } from "../hooks/useResolvedSession";

export default function RequireCustomer() {
  const { user, loading } = useResolvedSession();

  if (loading) {
    return null;
  }

  if (user?.role !== "Kunde") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}