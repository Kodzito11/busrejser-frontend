import { Navigate, Outlet } from "react-router-dom";
import { useResolvedSession } from "../hooks/useResolvedSession";

export default function RequireAuth() {
  const { user, loading } = useResolvedSession();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}