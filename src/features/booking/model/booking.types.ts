export const BookingStatus = {
  Active: 0,
  Cancelled: 1,
} as const;

export type BookingStatusType =
  (typeof BookingStatus)[keyof typeof BookingStatus];

export type Booking = {
  bookingId: number;
  rejseId: number;
  userId?: number | null;
  bookingReference: string;
  kundeNavn: string;
  kundeEmail: string;
  antalPladser: number;
  status: BookingStatusType;
  createdAt: string;
};

export type BookingCreate = {
  rejseId: number;
  kundeNavn: string;
  kundeEmail: string;
  antalPladser: number;
};

export type BookingCreateResponse = {
  bookingId: number;
  bookingReference: string;
};