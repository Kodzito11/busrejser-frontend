export type DashboardStats = {
  busCount: number;
  rejseCount: number;
  bookingCount: number;
  activeBookingCount: number;
  cancelledBookingCount: number;
  activeRevenue: number;
  cancelledRevenue: number;
  averageFillPercent: number;
  futureTripCount: number;
  ongoingTripCount: number;
  completedTripCount: number;
};

export type TripStatus = "kommende" | "igang" | "afsluttet";

export type TripInsight = {
  rejseId: number;
  title: string;
  destination: string;
  startAt: string;
  endAt: string;
  price: number;
  maxSeats: number;
  activeSeats: number;
  cancelledSeats: number;
  fillPercent: number;
  activeBookings: number;
  cancelledBookings: number;
  revenue: number;
  status: TripStatus;
};