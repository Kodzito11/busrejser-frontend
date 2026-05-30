import { Navigate, Outlet } from "react-router-dom";
import { useResolvedSession } from "../hooks/useResolvedSession";
import { devLog } from "../../../shared/utils/devLog";

export default function RequireStaff() {
  const { user, loading } = useResolvedSession();

  devLog("AUTH", "RequireStaff check", {
    loading,
    hasUser: !!user,
    role: user?.role,
  });

  if (loading) {
    devLog("AUTH", "RequireStaff loading -> wait");
    return null;
  }

  const isStaff = user?.role === "Admin" || user?.role === "Medarbejder";

  if (!isStaff) {
    devLog("AUTH", "RequireStaff denied -> redirect /login", {
      role: user?.role,
    });

    return <Navigate to="/login" replace />;
  }

  devLog("AUTH", "RequireStaff allowed", {
    role: user.role,
  });

  return <Outlet />;
}