import { Navigate, Route, Routes } from "react-router-dom";

import "../styles/app.css";
import "../styles/layout.css";
import "../styles/home.css";
import "../styles/admin.css";
import "../styles/kunde.css";
import "../styles/auth.css";

import HomePage from "../features/public/pages/HomePage";
import AboutPage from "../features/public/pages/AboutPage";

import RejserPage from "../features/rejse/pages/RejserPage";
import RejseDetaljePage from "../features/rejse/pages/RejseDetaljePage";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";

import KundeDashboardPage from "../features/customer/pages/KundeDashboardPage";

import BookRejsePage from "../features/booking/pages/CheckoutPage";
import MineBookingerPage from "../features/booking/pages/MineBookinger";

import BetalingSuccessPage from "../features/payment/pages/BetalingSuccessPage";
import BetalingCancelPage from "../features/payment/pages/BetalingCancelPage";

import AdminBusPage from "../features/bus/pages/AdminBusPage";
import AdminRejsePage from "../features/rejse/pages/AdminRejsePage";
import AdminBookingPage from "../features/booking/pages/AdminBookingPage";
import AdminHomePage from "../features/admin/pages/AdminHomePage";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import { getCurrentUser } from "../features/auth/utils/auth.storage";

export default function App() {
  const user = getCurrentUser();

  const isCustomer = user?.role === "Kunde";
  const isStaff = user?.role === "Admin" || user?.role === "Medarbejder";

  return (
    <Routes>
      <Route element={<MainLayout />}>
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
          element={
            isStaff ? <Navigate to="/admin/busser" replace /> : <Navigate to="/" replace />
          }
        />
      </Route>

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
  );
}