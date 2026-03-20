import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { busApi } from "../../bus/api/busApi";
import { rejseApi } from "../../rejse/api/rejseApi";
import { bookingApi } from "../../booking/api/bookingApi";

import DashboardActionInsights from "../components/DashboardActionInsights";
import DashboardMiniBarChart from "../components/DashboardMiniBarChart";
import DashboardPanel from "../components/DashboardPanel";
import DashboardStatCard from "../components/DashboardStatCard";
import DashboardUpcomingTripsTable from "../components/DashboardUpcomingTripsTable";
import MetricRow from "../components/MetricRow";
import QuickFact from "../components/QuickFact";

import type { Bus } from "../../bus/model/bus.types";
import type { Rejse } from "../../rejse/model/rejse.types";
import type { BookingListItem } from "../../booking/model/booking.types";
import type {
  DashboardStats,
  TripInsight,
} from "../types/adminDashboard.types";

import {
  buildBookingStatusChartData,
  buildDashboardActionInsights,
  buildRevenueChartData,
  buildTopTripsChartData,
} from "../utils/adminDashboardChartHelpers";

import {
  buildDashboardStats,
  buildTripInsights,
  formatDashboardCurrency,
  formatDashboardDate,
  getNearlyFullTrips,
  getPopularTrips,
  getStatusLabel,
  getUpcomingTrips,
} from "../utils/adminDashboardHelpers";

export default function AdminHomePage() {
  const navigate = useNavigate();

  const [buses, setBuses] = useState<Bus[]>([]);
  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [bookings, setBookings] = useState<BookingListItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [busData, rejseData, bookingData] = await Promise.all([
        busApi.list(),
        rejseApi.list(),
        bookingApi.list(),
      ]);

      setBuses(Array.isArray(busData) ? busData : []);
      setRejser(Array.isArray(rejseData) ? rejseData : []);
      setBookings(Array.isArray(bookingData) ? bookingData : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Kunne ikke hente dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const tripInsights = useMemo<TripInsight[]>(() => {
    return buildTripInsights(rejser, bookings);
  }, [rejser, bookings]);

  const stats = useMemo<DashboardStats>(() => {
    return buildDashboardStats(buses, rejser, bookings, tripInsights);
  }, [buses, rejser, bookings, tripInsights]);

  const upcomingTrips = useMemo(() => {
    return getUpcomingTrips(tripInsights, 6);
  }, [tripInsights]);

  const popularTrips = useMemo(() => {
    return getPopularTrips(tripInsights, 5);
  }, [tripInsights]);

  const nearlyFullTrips = useMemo(() => {
    return getNearlyFullTrips(tripInsights, 5);
  }, [tripInsights]);

  const topTrip = popularTrips[0] ?? null;

  const topTripsChartData = useMemo(() => {
    return buildTopTripsChartData(popularTrips, 5);
  }, [popularTrips]);

  const revenueChartData = useMemo(() => {
    return buildRevenueChartData(tripInsights, 5);
  }, [tripInsights]);

  const bookingStatusChartData = useMemo(() => {
    return buildBookingStatusChartData(
      stats.activeBookingCount,
      stats.cancelledBookingCount
    );
  }, [stats.activeBookingCount, stats.cancelledBookingCount]);

  const actionInsights = useMemo(() => {
    return buildDashboardActionInsights(tripInsights);
  }, [tripInsights]);

  function openRejse(rejseId?: number) {
    if (!rejseId) return;

    navigate("/admin/rejser", {
      state: { highlightRejseId: rejseId },
    });
  }

  return (
    <div className="page">
      <div className="card">
        <div className="section-header">
          <div>
            <h1>Dashboard</h1>
            <p className="muted">
              Overblik over drift, bookinger og fyldningsgrad.
            </p>
          </div>

          <button className="btn" onClick={loadDashboard} disabled={loading}>
            {loading ? "Loader..." : "Refresh"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>

      <div className="dashboardStatsGrid dashboardStatsGrid--v2">
        <DashboardStatCard
          title="Busser"
          value={stats.busCount}
          subtitle="Totalt i systemet"
          onClick={() => navigate("/admin/busser")}
        />

        <DashboardStatCard
          title="Rejser"
          value={stats.rejseCount}
          subtitle={`${stats.futureTripCount} kommende`}
          onClick={() => navigate("/admin/rejser")}
        />

        <DashboardStatCard
          title="Bookinger"
          value={stats.bookingCount}
          subtitle={`${stats.activeBookingCount} aktive`}
          onClick={() => navigate("/admin/bookings")}
        />

        <DashboardStatCard
          title="Omsætning"
          value={formatDashboardCurrency(stats.activeRevenue)}
          subtitle="Aktive bookinger"
          onClick={() => navigate("/admin/bookings")}
        />
      </div>

      <div className="dashboardInfoGrid">
        <DashboardPanel title="Kerneindsigter" subtitle="Hurtigt overblik">
          <div className="dashboardMetricList">
            <MetricRow
              label="Aktive bookinger"
              value={String(stats.activeBookingCount)}
            />
            <MetricRow
              label="Annullerede bookinger"
              value={String(stats.cancelledBookingCount)}
            />
            <MetricRow
              label="Gns. fyldningsgrad"
              value={`${stats.averageFillPercent}%`}
            />
            <MetricRow
              label="Annulleret omsætning"
              value={formatDashboardCurrency(stats.cancelledRevenue)}
            />
            <MetricRow
              label="I gang nu"
              value={String(stats.ongoingTripCount)}
            />
            <MetricRow
              label="Afsluttede rejser"
              value={String(stats.completedTripCount)}
            />
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Mest populære rejse"
          subtitle="Baseret på aktive pladser"
          action={
            topTrip ? (
              <button
                className="btn ghost"
                type="button"
                onClick={() => openRejse(topTrip.rejseId)}
              >
                Se rejse
              </button>
            ) : undefined
          }
        >
          {!topTrip ? (
            <p className="muted">Ingen rejser fundet endnu.</p>
          ) : (
            <div className="dashboardHighlight">
              <h3>
                {topTrip.title}{" "}
                <span className="muted">· {topTrip.destination}</span>
              </h3>

              <div className="dashboardHighlightMeta">
                <span className={`statusBadge ${topTrip.status}`}>
                  {getStatusLabel(topTrip.status)}
                </span>
                <span>{formatDashboardDate(topTrip.startAt)}</span>
              </div>

              <div className="capacity dashboardCapacity">
                <div className="capacity-bar">
                  <div
                    className="capacity-fill"
                    style={{ width: `${topTrip.fillPercent}%` }}
                  />
                </div>
                <div className="capacity-text">
                  {topTrip.activeSeats}/{topTrip.maxSeats} pladser ·{" "}
                  {topTrip.fillPercent}%
                </div>
              </div>

              <div className="dashboardQuickFacts">
                <QuickFact
                  label="Aktive bookinger"
                  value={topTrip.activeBookings}
                />
                <QuickFact
                  label="Omsætning"
                  value={formatDashboardCurrency(topTrip.revenue)}
                />
                <QuickFact
                  label="Annullerede pladser"
                  value={topTrip.cancelledSeats}
                />
              </div>
            </div>
          )}
        </DashboardPanel>
      </div>

      <div className="dashboardInfoGrid">
        <DashboardPanel
          title="Næsten fulde rejser"
          subtitle="80% fyldt eller mere"
          action={
            <button
              className="btn ghost"
              type="button"
              onClick={() => navigate("/admin/rejser")}
            >
              Gå til rejser
            </button>
          }
        >
          {loading ? (
            <p className="muted">Loader...</p>
          ) : nearlyFullTrips.length === 0 ? (
            <p className="muted">Ingen rejser er tæt på fuld kapacitet endnu.</p>
          ) : (
            <div className="dashboardList">
              {nearlyFullTrips.map((trip) => (
                <button
                  key={trip.rejseId}
                  type="button"
                  className="dashboardListItem"
                  onClick={() => openRejse(trip.rejseId)}
                >
                  <div>
                    <strong>{trip.title}</strong>
                    <p className="muted">
                      {trip.destination} · {formatDashboardDate(trip.startAt)}
                    </p>
                  </div>

                  <div className="dashboardListItemRight">
                    <span className="dashboardPill">{trip.fillPercent}%</span>
                    <span className="muted">
                      {trip.activeSeats}/{trip.maxSeats}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel title="Top 5 rejser" subtitle="Efter aktive pladser">
          {loading ? (
            <p className="muted">Loader...</p>
          ) : popularTrips.length === 0 ? (
            <p className="muted">Ingen rejser fundet.</p>
          ) : (
            <div className="dashboardMetricList">
              {popularTrips.map((trip, index) => (
                <MetricRow
                  key={trip.rejseId}
                  label={`${index + 1}. ${trip.title}`}
                  value={`${trip.activeSeats} pladser`}
                  sublabel={`${trip.destination} · ${trip.fillPercent}% fyldt`}
                />
              ))}
            </div>
          )}
        </DashboardPanel>
      </div>

      <div className="dashboardInfoGrid">
        <DashboardPanel title="Booking status" subtitle="Aktive vs annullerede">
          <DashboardMiniBarChart
            items={bookingStatusChartData}
            valueFormatter={(value) => `${value}`}
          />
        </DashboardPanel>

        <DashboardPanel title="Handlinger" subtitle="Simple model-baserede signaler">
          <DashboardActionInsights
            items={actionInsights}
            onItemClick={(item) => openRejse(item.tripId)}
          />
        </DashboardPanel>
      </div>

      <div className="dashboardInfoGrid">
        <DashboardPanel title="Top rejser" subtitle="Efter aktive pladser">
          <DashboardMiniBarChart
            items={topTripsChartData}
            valueFormatter={(value) => `${value} pladser`}
            onItemClick={(item) => openRejse(item.tripId)}
          />
        </DashboardPanel>

        <DashboardPanel title="Omsætning pr. rejse" subtitle="Top 5">
          <DashboardMiniBarChart
            items={revenueChartData}
            valueFormatter={(value) => formatDashboardCurrency(value)}
            onItemClick={(item) => openRejse(item.tripId)}
          />
        </DashboardPanel>
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Kommende rejser</h2>
            <p className="muted">
              Næste afgange med status, belægning og omsætning.
            </p>
          </div>
        </div>

        <DashboardUpcomingTripsTable trips={upcomingTrips} loading={loading} />
      </div>
    </div>
  );
}