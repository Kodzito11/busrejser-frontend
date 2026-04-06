import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/busplanen-high-resolution-logo-transparent.png";
import { getCurrentUser, logout } from "../../features/auth/utils/auth.storage";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(getCurrentUser());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".userMenu")) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  }

  const isCustomer = user?.role === "Kunde";
  const isStaff = user?.role === "Admin" || user?.role === "Medarbejder";

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
          <div className="userMenu">
            <button
              type="button"
              className="userMenuButton"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {user.username} ▾
            </button>

            {menuOpen && (
              <div className="userDropdown">
                {isCustomer && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/kunde");
                    }}
                  >
                    Mit dashboard
                  </button>
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