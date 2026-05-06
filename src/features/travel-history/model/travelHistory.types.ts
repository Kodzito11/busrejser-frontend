export type TravelHistoryItem = {
  travelHistoryId: number;
  rejseId: number;
  bookingId: number;
  completedAt: string;
  destination: string;
  country?: string | null;
  city?: string | null;
  region?: string | null;
  municipality?: string | null;
};
