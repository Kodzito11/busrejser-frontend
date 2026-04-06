import { Route, Routes } from "react-router-dom";

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

import MainLayout from "../app/layouts/MainLayout";
import AdminLayout from "../app/layouts/AdminLayout";

import ProfilePage from "../features/user/pages/ProfilePage";

import RequireStaff from "../features/auth/components/RequireStaff";
import RequireCustomer from "../features/auth/components/RequireCustomer";
import RequireStaffRedirect from "../features/auth/components/RequireStaffRedirect";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC + MAIN LAYOUT */}
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

        <Route path="/profil" element={<ProfilePage />} />

        {/* CUSTOMER PROTECTED */}
        <Route element={<RequireCustomer />}>
          <Route path="/kunde" element={<KundeDashboardPage />} />
          <Route path="/mine-bookinger" element={<MineBookingerPage />} />
        </Route>

        {/* OPTIONAL REDIRECT */}
        <Route
          path="/busser"
          element={<RequireStaffRedirect/>}
        />
      </Route>

      {/* ADMIN PROTECTED */}
      <Route element={<RequireStaff />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="busser" element={<AdminBusPage />} />
          <Route path="rejser" element={<AdminRejsePage />} />
          <Route path="bookings" element={<AdminBookingPage />} />
        </Route>
      </Route>
    </Routes>
  );
}