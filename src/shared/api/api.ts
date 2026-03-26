import { authApi } from "../../features/auth/api/authApi";
import { bookingApi } from "../../features/booking/api/bookingApi";
import { busApi } from "../../features/bus/api/busApi";
import { stripeApi } from "../../features/payment/api/stripeApi";
import { rejseApi } from "../../features/rejse/api/rejseApi";

export const api = {
  auth: authApi,
  bookings: bookingApi,
  buses: busApi,
  stripe: stripeApi,
  rejser: rejseApi,
};