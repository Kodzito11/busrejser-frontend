import { http } from "../../../shared/api/http";

export type CreateCheckoutSessionRequest = {
  rejseId: number;
  antalPladser: number;
  kundeNavn: string;
  kundeEmail: string;
};

export type CreateCheckoutSessionResponse = {
  url: string;
};

export type CheckoutStatusResponse = {
  sessionId: string;
  isPaid: boolean;
  bookingExists: boolean;
  status: "booking_created" | "processing" | "unpaid";
  bookingId?: number | null;
  bookingReference?: string | null;
};

export const stripeApi = {
  createCheckoutSession: (payload: CreateCheckoutSessionRequest) =>
    http<CreateCheckoutSessionResponse>("/api/Stripe/create-checkout-session", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getCheckoutStatus: (sessionId: string) =>
    http<CheckoutStatusResponse>(
      `/api/Stripe/checkout-status?sessionId=${encodeURIComponent(sessionId)}`
    ),
};