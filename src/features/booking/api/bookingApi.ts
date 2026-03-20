import { http } from "../../../shared/api/http";
import type {
  Booking,
  BookingCreate,
  BookingCreateResponse,
  BookingListItem,
} from "../model/booking.types";

export const bookingApi = {
  create: (payload: BookingCreate) =>
    http<BookingCreateResponse>("/api/Booking", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  list: () => http<BookingListItem[]>("/api/Booking"),

  get: (id: number) => http<Booking>(`/api/Booking/${id}`),

  mine: () => http<Booking[]>("/api/Booking/mine"),

  getByRejseId: (rejseId: number) =>
    http<BookingListItem[]>(`/api/Booking/rejse/${rejseId}`),

  getAvailableSeats: (rejseId: number) =>
    http<number>(`/api/Booking/rejse/${rejseId}/available-seats`),

  cancel: (id: number) =>
    http<void>(`/api/Booking/${id}/cancel`, {
      method: "PUT",
    }),

  reactivate: (id: number) =>
    http<void>(`/api/Booking/${id}/reactivate`, {
      method: "PUT",
    }),
};