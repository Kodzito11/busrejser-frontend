import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "../styles/app.css";
import "../styles/layout.css";
import "../styles/home.css";
import "../styles/admin.css";
import "../styles/kunde.css";
import "../styles/auth.css";

import HomePage from "../features/public/pages/HomePage";
import AboutPage from "../features/public/pages/AboutPage";

import AdminBusPage from "../features/bus/pages/AdminBusPage";
import AdminRejsePage from "../features/rejse/pages/AdminRejsePage";
import AdminBookingPage from "../features/booking/pages/AdminBookingPage";
import AdminHomePage from "../features/admin/pages/AdminHomePage";

import RejserPage from "../features/rejse/pages/RejserPage";
import RejseDetaljePage from "../features/rejse/pages/RejseDetaljePage";

import LoginPage from "../auth/pages/LoginPage";
import RegisterPage from "../auth/pages/RegisterPage";

import KundeDashboardPage from "../features/customer/pages/KundeDashboardPage";

import BookRejsePage from "../features/booking/pages/CheckoutPage";
import MineBookingerPage from "../features/booking/pages/MineBookinger";

import BetalingSuccessPage from "../features/payment/pages/BetalingSuccessPage";
import BetalingCancelPage from "../features/payment/pages/BetalingCancelPage";

import AdminLayout from "../layouts/AdminLayout";

import logo from "../assets/busplanen-high-resolution-logo-transparent.png";
import { getCurrentUser, logout } from "../auth/auth";

import ForgotPasswordPage from "../auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../auth/pages/ResetPasswordPage";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setUser(null);
    navigate("/");
  }

  const isCustomer = user?.role === "Kunde";
  const isStaff = user?.role === "Admin" || user?.role === "Medarbejder";

  return (
    <div className="shell">
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
            <>
              <span className="navUser">Hej, {user.username}</span>
              <button type="button" onClick={handleLogout}>
                Log ud
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/om" element={<AboutPage />} />
          <Route path="/rejser" element={<RejserPage />} />
          <Route path="/rejse/:id" element={<RejseDetaljePage />} />
          <Route path="/book/:id" element={<BookRejsePage />} />

          <Route path="/betaling/success" element={<BetalingSuccessPage />} />
          <Route path="/betaling/cancel" element={<BetalingCancelPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/glemt-adgangskode" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="/kunde"
            element={isCustomer ? <KundeDashboardPage /> : <Navigate to="/" replace />}
          />

          <Route
            path="/mine-bookinger"
            element={isCustomer ? <MineBookingerPage /> : <Navigate to="/" replace />}
          />

          <Route
            path="/busser"
            element={isStaff ? <Navigate to="/admin/busser" replace /> : <Navigate to="/" replace />}
          />

          <Route
            path="/admin"
            element={isStaff ? <AdminLayout /> : <Navigate to="/" replace />}
          >
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