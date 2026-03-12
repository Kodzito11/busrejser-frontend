import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import BusCrud from "./pages/BusCrud";
import Rejser from "./pages/Rejser";
import Login from "./pages/Login";
import logo from "./assets/busplanen-high-resolution-logo-transparent.png";
import { getCurrentUser, logout } from "./api";
import BookRejse from "./pages/BookRejse";
import MineBookinger from "./pages/MineBookinger";
import RejseDetalje from "./pages/RejseDetalje";

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
    navigate("/");
  }

  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
          <div className="brand">
            <img src={logo} alt="BusPlanen logo" className="logo" />
          </div>
        </NavLink>

        <nav className="nav">
          <NavLink to="/om" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
            Om os
          </NavLink>

          <NavLink to="/rejser" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
            Rejser
          </NavLink>

          {user && (
            <NavLink to="/busser" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
              Busser
            </NavLink>
          )}

          <NavLink to="/mine-bookinger" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
            Mine bookinger
          </NavLink>

          {!user ? (
            <NavLink to="/login" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
              Login
            </NavLink>
          ) : (
            <>
              <span className="navUser">Hej, {user.username}</span>
              <button onClick={handleLogout}>Log ud</button>
            </>
          )}
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/om" element={<About />} />
          <Route path="/busser" element={<BusCrud />} />
          <Route path="/rejser" element={<Rejser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book/:id" element={<BookRejse />} />
          <Route path="/mine-bookinger" element={<MineBookinger />} />
          <Route path="/rejse/:id" element={<RejseDetalje />} />
        </Routes>
      </main>

      <footer className="footer">© {new Date().getFullYear()} BusPlanen</footer>
    </div>
  );
}