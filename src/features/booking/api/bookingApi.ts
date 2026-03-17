import { http } from "../../../shared/api/http";
import type {Booking, BookingCreate, BookingCreateResponse} from "../model/booking.types";

export const bookingApi = {
  create: (payload: BookingCreate) =>
    http<BookingCreateResponse>("/api/booking", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  get: (id: number) => http<Booking>(`/api/booking/${id}`),

  listByRejse: (rejseId: number) =>
    http<Booking[]>(`/api/booking/rejse/${rejseId}`),

  mine: () => http<Booking[]>("/api/booking/mine"),

  getAvailableSeats: (rejseId: number) =>
    http<number>(`/api/booking/rejse/${rejseId}/available-seats`),

  cancel: (id: number) =>
    http<void>(`/api/booking/${id}/cancel`, {
      method: "PUT",
    }),

  reactivate: (id: number) =>
    http<void>(`/api/booking/${id}/reactivate`, {
      method: "PUT",
    }),
};