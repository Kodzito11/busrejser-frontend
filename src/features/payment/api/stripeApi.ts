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

export const stripeApi = {
  createCheckoutSession: (payload: CreateCheckoutSessionRequest) =>
    http<CreateCheckoutSessionResponse>("/api/Stripe/create-checkout-session", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};