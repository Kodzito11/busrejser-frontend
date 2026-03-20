import type { Bus } from "../../bus/model/bus.types";
import type { Rejse } from "../../rejse/model/rejse.types";
import type { BookingListItem } from "../../booking/model/booking.types";
import type {
  DashboardStats,
  TripInsight,
  TripStatus,
} from "../types/adminDashboard.types";

export function buildTripInsights(
  rejser: Rejse[],
  bookings: BookingListItem[]
): TripInsight[] {
  const activeSeatsByRejse: Record<number, number> = {};
  const cancelledSeatsByRejse: Record<number, number> = {};
  const activeBookingsByRejse: Record<number, number> = {};
  const cancelledBookingsByRejse: Record<number, number> = {};

  for (const booking of bookings) {
    const seats = booking.antalPladser ?? 0;

    if (booking.isCancelled) {
      cancelledSeatsByRejse[booking.rejseId] =
        (cancelledSeatsByRejse[booking.rejseId] ?? 0) + seats;

      cancelledBookingsByRejse[booking.rejseId] =
        (cancelledBookingsByRejse[booking.rejseId] ?? 0) + 1;
    } else {
      activeSeatsByRejse[booking.rejseId] =
        (activeSeatsByRejse[booking.rejseId] ?? 0) + seats;

      activeBookingsByRejse[booking.rejseId] =
        (activeBookingsByRejse[booking.rejseId] ?? 0) + 1;
    }
  }

  return rejser.map((rejse) => {
    const activeSeats =
      activeSeatsByRejse[rejse.rejseId] ?? rejse.bookedSeats ?? 0;

    const cancelledSeats = cancelledSeatsByRejse[rejse.rejseId] ?? 0;
    const activeBookings = activeBookingsByRejse[rejse.rejseId] ?? 0;
    const cancelledBookings = cancelledBookingsByRejse[rejse.rejseId] ?? 0;

    const maxSeats = rejse.maxSeats || 0;
    const fillPercent =
      maxSeats > 0
        ? Math.min(100, Math.round((activeSeats / maxSeats) * 100))
        : 0;

    return {
      rejseId: rejse.rejseId,
      title: rejse.title,
      destination: rejse.destination,
      startAt: rejse.startAt,
      endAt: rejse.endAt,
      price: rejse.price,
      maxSeats,
      activeSeats,
      cancelledSeats,
      fillPercent,
      activeBookings,
      cancelledBookings,
      revenue: activeSeats * rejse.price,
      status: getTripStatus(rejse.startAt, rejse.endAt),
    };
  });
}

export function buildDashboardStats(
  buses: Bus[],
  rejser: Rejse[],
  bookings: BookingListItem[],
  tripInsights: TripInsight[]
): DashboardStats {
  const activeBookings = bookings.filter((b) => !b.isCancelled);
  const cancelledBookings = bookings.filter((b) => b.isCancelled);

  const activeRevenue = tripInsights.reduce((sum, trip) => sum + trip.revenue, 0);

  const cancelledRevenue = bookings.reduce((sum, booking) => {
    if (!booking.isCancelled) return sum;

    const trip = rejser.find((r) => r.rejseId === booking.rejseId);
    if (!trip) return sum;

    return sum + booking.antalPladser * trip.price;
  }, 0);

  const averageFillPercent =
    tripInsights.length > 0
      ? Math.round(
          tripInsights.reduce((sum, trip) => sum + trip.fillPercent, 0) /
            tripInsights.length
        )
      : 0;

  return {
    busCount: buses.length,
    rejseCount: rejser.length,
    bookingCount: bookings.length,
    activeBookingCount: activeBookings.length,
    cancelledBookingCount: cancelledBookings.length,
    activeRevenue,
    cancelledRevenue,
    averageFillPercent,
    futureTripCount: tripInsights.filter((t) => t.status === "kommende").length,
    ongoingTripCount: tripInsights.filter((t) => t.status === "igang").length,
    completedTripCount: tripInsights.filter((t) => t.status === "afsluttet").length,
  };
}

export function getUpcomingTrips(trips: TripInsight[], limit = 6) {
  return [...trips]
    .filter((trip) => new Date(trip.startAt).getTime() >= Date.now())
    .sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    )
    .slice(0, limit);
}

export function getPopularTrips(trips: TripInsight[], limit = 5) {
  return [...trips]
    .sort((a, b) => {
      if (b.activeSeats !== a.activeSeats) {
        return b.activeSeats - a.activeSeats;
      }

      if (b.fillPercent !== a.fillPercent) {
        return b.fillPercent - a.fillPercent;
      }

      return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
    })
    .slice(0, limit);
}

export function getNearlyFullTrips(trips: TripInsight[], limit = 5) {
  return [...trips]
    .filter((trip) => trip.fillPercent >= 80 && trip.status !== "afsluttet")
    .sort((a, b) => b.fillPercent - a.fillPercent)
    .slice(0, limit);
}

export function getTripStatus(
  startAt?: string,
  endAt?: string
): TripStatus {
  const now = Date.now();
  const start = startAt ? new Date(startAt).getTime() : NaN;
  const end = endAt ? new Date(endAt).getTime() : NaN;

  if (Number.isNaN(start) || Number.isNaN(end)) return "kommende";
  if (now < start) return "kommende";
  if (now > end) return "afsluttet";
  return "igang";
}

export function getStatusLabel(status: TripStatus) {
  if (status === "igang") return "I gang";
  if (status === "afsluttet") return "Afsluttet";
  return "Kommende";
}

export function formatDashboardDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("da-DK", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function formatDashboardCurrency(value: number) {
  return `${value.toLocaleString("da-DK")} kr.`;
}