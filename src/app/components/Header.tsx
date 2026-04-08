import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/busplanen-high-resolution-logo-transparent.png";
import { getCurrentUser, logout } from "../../features/auth/utils/auth.storage";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const user = getCurrentUser();

  const isCustomer = user?.role === "Kunde";
  const isEmployee = user?.role === "Medarbejder";
  const isAdmin = user?.role === "Admin";
  const isStaff = isAdmin || isEmployee;

  const displayName =
    user?.fullName ||
    user?.email ||
    "Konto";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function goTo(path: string) {
    setMenuOpen(false);
    navigate(path);
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="topbar">
      <NavLink to="/" end className="brand">
        <img src={logo} alt="BusPlanen logo" className="logo" />
      </NavLink>

      <nav className="nav">
        <NavLink
          to="/om"
          className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
        >
          Om os
        </NavLink>

        <NavLink
          to="/rejser"
          className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
        >
          Rejser
        </NavLink>

        {isCustomer && (
          <NavLink
            to="/kunde"
            className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
          >
            Mit dashboard
          </NavLink>
        )}

        {isStaff && (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
          >
            Admin
          </NavLink>
        )}

        {!user ? (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
          >
            Login
          </NavLink>
        ) : (
          <div ref={menuRef} className="userMenu">
            <button
              type="button"
              className="userMenuButton"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {displayName} ▾
            </button>

            {menuOpen && (
              <div className="userDropdown">
                <button type="button" onClick={() => goTo("/profil")}>
                  Min profil
                </button>

                {isCustomer && (
                  <>
                    <button type="button" onClick={() => goTo("/kunde")}>
                      Mit dashboard
                    </button>

                    <button type="button" onClick={() => goTo("/mine-bookinger")}>
                      Mine bookinger
                    </button>
                  </>
                )}

                {isStaff && (
                  <>
                    <button type="button" onClick={() => goTo("/admin")}>
                      Admin panel
                    </button>

                    <button type="button" onClick={() => goTo("/admin/rejser")}>
                      Administrér rejser
                    </button>

                    <button type="button" onClick={() => goTo("/admin/busser")}>
                      Administrér busser
                    </button>

                    <button type="button" onClick={() => goTo("/admin/bookings")}>
                      Administrér bookinger
                    </button>
                  </>
                )}

                {isAdmin && (
                  <div className="muted" style={{ padding: "8px 12px" }}>
                    Admin adgang
                  </div>
                )}

                {isEmployee && (
                  <div className="muted" style={{ padding: "8px 12px" }}>
                    Medarbejder adgang
                  </div>
                )}

                <button type="button" onClick={handleLogout}>
                  Log ud
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}