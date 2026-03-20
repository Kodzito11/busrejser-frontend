export const BookingStatus = {
  Active: 0,
  Cancelled: 1,
} as const;

export type BookingStatusType =
  (typeof BookingStatus)[keyof typeof BookingStatus];

export type UserRole = "Admin" | "Medarbejder" | "Kunde";

export type Booking = {
  bookingId: number;
  rejseId: number;
  userId?: number | null;
  role?: UserRole | null;

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

export type BookingListItem = {
  bookingId: number;
  rejseId: number;
  kundeNavn: string;
  kundeEmail: string;
  antalPladser: number;
  userId: number | null;
  role?: string | null;
  bookingReference?: string;
  isCancelled: boolean;
  createdAt?: string;
};