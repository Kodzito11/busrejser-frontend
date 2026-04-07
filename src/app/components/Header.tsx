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
  const isStaff = user?.role === "Admin" || user?.role === "Medarbejder";

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
              {user.fullname || user.email} ▾
            </button>

            {menuOpen && (
              <div className="userDropdown">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profil");
                  }}
                >
                  Min profil
                </button>

                {isCustomer && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/mine-bookinger");
                    }}
                  >
                    Mine bookinger
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