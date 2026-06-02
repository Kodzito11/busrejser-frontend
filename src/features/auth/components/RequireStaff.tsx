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

  if (!user) {
    devLog("AUTH", "RequireStaff denied -> redirect /login");
    return <Navigate to="/login" replace />;
  }

  if (!isStaff) {
    devLog("AUTH", "RequireStaff denied -> redirect /kunde", {
      role: user?.role,
    });

    return <Navigate to="/kunde" replace />;
  }

  devLog("AUTH", "RequireStaff allowed", {
    role: user.role,
  });

  return <Outlet />;
}
