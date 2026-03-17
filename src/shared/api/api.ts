import { authApi } from "../../features/auth/api/authApi";
import { bookingApi } from "../../features/booking/api/bookingApi";
import { busApi } from "../../features/bus/api/busApi";
import { rejseApi } from "../../features/rejse/api/rejseApi";

export const api = {
  auth: authApi,
  bookings: bookingApi,
  buses: busApi,
  rejser: rejseApi,
};