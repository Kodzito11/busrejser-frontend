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

  if (!user) {
    devLog("AUTH", "RequireCustomer denied -> redirect /login");
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "Kunde") {
    devLog("AUTH", "RequireCustomer denied -> redirect /admin", {
      role: user?.role,
    });

    return <Navigate to="/admin" replace />;
  }

  devLog("AUTH", "RequireCustomer allowed");

  return <Outlet />;
}
