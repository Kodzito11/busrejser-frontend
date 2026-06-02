import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import {
  canManageBuses,
  getCurrentUser,
} from "../../features/auth/utils/auth.storage";
import { logoutUser } from "../../features/auth/utils/logoutUser";

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const isStaff = canManageBuses();

  async function handleLogout() {
    await logoutUser();
    navigate("/login", { replace: true });
  }

  if (!isStaff) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <div className="adminBrand">
          <h2>BusPlanen Admin</h2>
          <p className="muted">Internt panel</p>
        </div>

        <nav className="adminNav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "adminLink active" : "adminLink"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/busser"
            className={({ isActive }) =>
              isActive ? "adminLink active" : "adminLink"
            }
          >
            Busser
          </NavLink>

          <NavLink
            to="/admin/rejser"
            className={({ isActive }) =>
              isActive ? "adminLink active" : "adminLink"
            }
          >
            Rejser
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              isActive ? "adminLink active" : "adminLink"
            }
          >
            Bookings
          </NavLink>

          <NavLink
            to="/admin/progression"
            className={({ isActive }) =>
              isActive ? "adminLink active" : "adminLink"
            }
          >
            Progression
          </NavLink>
        </nav>
      </aside>

      <section className="adminMain">
        <header className="adminTopbar">
          <div>
            <p className="muted">Logget ind som</p>
            <strong>
              {user?.firstName || user?.lastName
                ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
                : user?.email}
            </strong>
          </div>

          <div className="adminTopbarActions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => navigate("/")}
            >
              Til hjemmeside
            </button>

            <button type="button" className="btn" onClick={handleLogout}>
              Log ud
            </button>
          </div>
        </header>

        <div className="adminContent">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
