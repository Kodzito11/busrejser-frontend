export type Booking = {
  bookingId: number;
  rejseId: number;
  bookingReference: string;
  kundeNavn: string;
  kundeEmail: string;
  antalPladser: number;
  status: number;
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