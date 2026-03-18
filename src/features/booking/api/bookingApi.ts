import { http } from "../../../shared/api/http";
import type {Booking, BookingCreate} from "../model/booking.types";

export const bookingApi = {
  create: (payload: BookingCreate) =>
    http<number>("/api/Booking", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  list: () => http<Booking[]>("/api/Booking"),

  get: (id: number) => http<Booking>(`/api/Booking/${id}`),

  mine: () => http<Booking[]>("/api/Booking/mine"),

  cancel: (id: number) =>
    http<void>(`/api/Booking/${id}/cancel`, {
      method: "PUT",
    }),

  reactivate: (id: number) =>
    http<void>(`/api/Booking/${id}/reactivate`, {
      method: "PUT",
    }),
};