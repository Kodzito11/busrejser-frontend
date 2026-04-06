import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/auth.storage";

export default function RequireCustomer() {
  const user = getCurrentUser();

  const isCustomer = user?.role === "Kunde";

  if (!isCustomer) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}