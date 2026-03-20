import type { TripInsight } from "../types/adminDashboard.types";

export type ChartTone = "default" | "success" | "warning" | "danger";

export type ChartBarItem = {
  label: string;
  value: number;
  subtitle?: string;
  tone?: ChartTone;
  tripId?: number;
};

export type DashboardActionInsight = {
  type: "warning" | "success" | "info";
  title: string;
  description: string;
  tripId?: number;
  cta?: string;
};

export function buildTopTripsChartData(
  trips: TripInsight[],
  limit = 5
): ChartBarItem[] {
  return [...trips]
    .sort((a, b) => b.activeSeats - a.activeSeats)
    .slice(0, limit)
    .map((trip) => ({
      label: trip.title,
      value: trip.activeSeats,
      subtitle: `${trip.destination} · ${trip.fillPercent}%`,
      tone: getFillTone(trip.fillPercent),
      tripId: trip.rejseId,
    }));
}

export function buildRevenueChartData(
  trips: TripInsight[],
  limit = 5
): ChartBarItem[] {
  return [...trips]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
    .map((trip) => ({
      label: trip.title,
      value: trip.revenue,
      subtitle: `${trip.destination} · ${trip.activeSeats} pladser`,
      tone: getRevenueTone(trip.revenue),
      tripId: trip.rejseId,
    }));
}

export function buildBookingStatusChartData(
  activeBookingCount: number,
  cancelledBookingCount: number
): ChartBarItem[] {
  return [
    {
      label: "Aktive",
      value: activeBookingCount,
      subtitle: "Ikke annullerede",
      tone: "success",
    },
    {
      label: "Annullerede",
      value: cancelledBookingCount,
      subtitle: "Tabte bookinger",
      tone: cancelledBookingCount > 0 ? "danger" : "default",
    },
  ];
}

export function buildDashboardActionInsights(
  trips: TripInsight[]
): DashboardActionInsight[] {
  const nearlyFull = [...trips]
    .filter((trip) => trip.fillPercent >= 80 && trip.status !== "afsluttet")
    .sort((a, b) => b.fillPercent - a.fillPercent);

  const lowFillUpcoming = [...trips]
    .filter(
      (trip) =>
        trip.status === "kommende" &&
        trip.fillPercent > 0 &&
        trip.fillPercent < 35
    )
    .sort((a, b) => a.fillPercent - b.fillPercent);

  const highCancelled = [...trips]
    .filter((trip) => trip.cancelledSeats >= 3 && trip.status !== "afsluttet")
    .sort((a, b) => b.cancelledSeats - a.cancelledSeats);

  const insights: DashboardActionInsight[] = [];

  if (nearlyFull.length > 0) {
    const top = nearlyFull[0];
    insights.push({
      type: "success",
      title: "Rejse tæt på udsolgt",
      description: `${top.title} er ${top.fillPercent}% fyldt og bør overvåges tæt.`,
      tripId: top.rejseId,
      cta: "Åbn rejse",
    });
  }

  if (lowFillUpcoming.length > 0) {
    const top = lowFillUpcoming[0];
    insights.push({
      type: "warning",
      title: "Lav fyldning kræver handling",
      description: `${top.title} er kun ${top.fillPercent}% fyldt og kan kræve pris/markedsføring.`,
      tripId: top.rejseId,
      cta: "Se rejse",
    });
  }

  if (highCancelled.length > 0) {
    const top = highCancelled[0];
    insights.push({
      type: "warning",
      title: "Usædvanligt mange annulleringer",
      description: `${top.title} har ${top.cancelledSeats} annullerede pladser.`,
      tripId: top.rejseId,
      cta: "Undersøg",
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "info",
      title: "Ingen kritiske afvigelser",
      description: "Dashboardet fandt ingen tydelige advarsler lige nu.",
    });
  }

  return insights.slice(0, 4);
}

function getFillTone(fillPercent: number): ChartTone {
  if (fillPercent >= 80) return "success";
  if (fillPercent >= 50) return "warning";
  if (fillPercent > 0) return "danger";
  return "default";
}

function getRevenueTone(revenue: number): ChartTone {
  if (revenue >= 10000) return "success";
  if (revenue >= 4000) return "warning";
  if (revenue > 0) return "default";
  return "danger";
}