import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

import HomePage from "../features/public/pages/Home";
import AboutPage from "../features/public/pages/About";

import AdminBusPage from "../features/bus/pages/AdminBusPage";
import AdminRejsePage from "../features/rejse/pages/AdminRejsePage";
import AdminBookingPage from "../features/booking/pages/AdminBookingPage";
import AdminHomePage from "../features/admin/pages/AdminHomePage";

import RejserPage from "../features/rejse/pages/RejserPage";
import RejseDetaljePage from "../features/rejse/pages/RejseDetaljePage";

import LoginPage from "../auth/pages/LoginPage";
import RegisterPage from "../auth/pages/RegisterPage";

import BookRejsePage from "../features/booking/pages/BookRejsePage";
import MineBookingerPage from "../features/booking/pages/MineBookinger";

import AdminLayout from "../layouts/AdminLayout";

import logo from "../assets/busplanen-high-resolution-logo-transparent.png";
import { getCurrentUser, logout } from "../auth/auth";

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

  const isCustomer = user?.role === "Kunde";

  const isStaff =
    user?.role === "Admin" || user?.role === "Medarbejder";

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

          {isStaff && (
            <NavLink to="/busser" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
              Busser
            </NavLink>
          )}

          {isCustomer && (
            <NavLink
              to="/mine-bookinger"
              className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
            >
              Mine bookinger
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
          <Route path="/" element={<HomePage />} />
          <Route path="/om" element={<AboutPage />} />
          <Route
            path="/busser"
            element={isStaff ? <AdminBusPage /> : <Navigate to="/" replace />}
          />
          <Route path="/rejser" element={<RejserPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/book/:id" element={<BookRejsePage />} />
          <Route
            path="/mine-bookinger"
            element={isCustomer ? <MineBookingerPage /> : <Navigate to="/" replace />}
          />
          <Route path="/rejse/:id" element={<RejseDetaljePage />} />
          <Route path="/register" element={<RegisterPage />} />
          
           <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHomePage />} />
            <Route path="busser" element={<AdminBusPage />} />
             <Route path="rejser" element={<AdminRejsePage />} />
             <Route path="bookings" element={<AdminBookingPage />} />
          </Route>
        </Routes>
      </main>

      <footer className="footer">© {new Date().getFullYear()} BusPlanen</footer>
    </div>
  );
}