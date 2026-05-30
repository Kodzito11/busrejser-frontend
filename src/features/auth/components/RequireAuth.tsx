import { Navigate, Outlet } from "react-router-dom";
import { useResolvedSession } from "../hooks/useResolvedSession";
import { devLog } from "../../../shared/utils/devLog";

export default function RequireAuth() {
  const { user, loading } = useResolvedSession();

  devLog("AUTH", "RequireAuth check", {
    loading,
    hasUser: !!user,
    role: user?.role,
  });

  if (loading) {
    devLog("AUTH", "RequireAuth loading -> wait");
    return null;
  }

  if (!user) {
    devLog("AUTH", "RequireAuth denied -> redirect /login");
    return <Navigate to="/login" replace />;
  }

  devLog("AUTH", "RequireAuth allowed");

  return <Outlet />;
}