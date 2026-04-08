import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./styles/foundation/tokens.css";
import "./styles/foundation/base.css";

import "./styles/layout/shell.css";
import "./styles/layout/topbar.css";
import "./styles/layout/user-menu.css";
import "./styles/layout/admin-layout.css";

import "./styles/ui/cards.css";
import "./styles/ui/buttons.css";
import "./styles/ui/forms.css";
import "./styles/ui/feedback.css";
import "./styles/ui/utilities.css";
import "./styles/ui/legacy-table.css";

import "./styles/features/home/hero.css";
import "./styles/features/home/search-bar.css";
import "./styles/features/home/trip-grid.css";

import "./styles/features/auth/auth-card.css";
import "./styles/features/auth/auth-form.css";
import "./styles/features/auth/password-field.css";

import "./styles/features/customer/mine-bookinger.css";
import "./styles/features/customer/booking-box.css";

import "./styles/features/public/rejse-detalje.css";
import "./styles/features/public/rejser-status.css";
import "./styles/features/public/rejse-kalender.css";

import "./styles/features/admin/bus/bus-image-modal.css";

import "./styles/features/admin/rejser/rejse-form.css";
import "./styles/features/admin/rejser/rejse-status.css";
import "./styles/features/admin/rejser/capacity.css";

import "./styles/features/admin/bookings/booking-expand.css";
import "./styles/features/admin/bookings/booking-status.css";
import "./styles/features/admin/bookings/role-badge.css";
import "./styles/features/admin/bookings/payment-badge.css";

import "./styles/features/admin/dashboard/stats-cards.css";
import "./styles/features/admin/dashboard/info-panels.css";
import "./styles/features/admin/dashboard/chart-list.css";
import "./styles/features/admin/dashboard/insight-cards.css";

import App from "./app/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);