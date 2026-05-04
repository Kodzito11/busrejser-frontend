import { authApi } from "../../features/auth/api/authApi";
import { bookingApi } from "../../features/booking/api/bookingApi";
import { busApi } from "../../features/bus/api/busApi";
import { stripeApi } from "../../features/payment/api/stripeApi";
import { rejseApi } from "../../features/rejse/api/rejseApi";
import { userApi } from "../../features/user/api/userApi";
import { badgeApi } from "../../features/badges/api/badgeApi";
import { progressionApi } from "../../features/progression/api/progressionApi";


export const api = {
  auth: authApi,
  bookings: bookingApi,
  buses: busApi,
  stripe: stripeApi,
  rejser: rejseApi,
  user: userApi,
  badges: badgeApi,
  progression: progressionApi,
};