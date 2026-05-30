import { Navigate, Outlet } from "react-router-dom";
import { useResolvedSession } from "../hooks/useResolvedSession";
import { devLog } from "../../../shared/utils/devLog";

export default function RequireCustomer() {
  const { user, loading } = useResolvedSession();

  devLog("AUTH", "RequireCustomer check", {
    loading,
    hasUser: !!user,
    role: user?.role,
  });

  if (loading) {
    devLog("AUTH", "RequireCustomer loading -> wait");
    return null;
  }

  if (user?.role !== "Kunde") {
    devLog("AUTH", "RequireCustomer denied -> redirect /login", {
      role: user?.role,
    });

    return <Navigate to="/login" replace />;
  }

  devLog("AUTH", "RequireCustomer allowed");

  return <Outlet />;
}