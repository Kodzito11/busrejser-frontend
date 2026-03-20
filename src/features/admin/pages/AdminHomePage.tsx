import { useNavigate } from "react-router-dom";

import { useEffect, useMemo, useState } from "react";
import { busApi } from "../../bus/api/busApi";
import { rejseApi } from "../../rejse/api/rejseApi";
import { bookingApi } from "../../booking/api/bookingApi";

import type { Bus } from "../../bus/model/bus.types";
import type { Rejse } from "../../rejse/model/rejse.types";
import type { BookingListItem } from "../../booking/model/booking.types";

type DashboardStats = {
  busCount: number;
  rejseCount: number;
  bookingCount: number;
  activeBookingCount: number;
};

export default function AdminHomePage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [bookings, setBookings] = useState<BookingListItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [busData, rejseData, bookingData] = await Promise.all([
        busApi.list(),
        rejseApi.list(),
        bookingApi.list(),
      ]);

      setBuses(busData);
      setRejser(rejseData);
      setBookings(bookingData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunne ikke hente dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = useMemo<DashboardStats>(() => {
    return {
      busCount: buses.length,
      rejseCount: rejser.length,
      bookingCount: bookings.length,
      activeBookingCount: bookings.filter((b) => !b.isCancelled).length,
    };
  }, [buses, rejser, bookings]);

  const newestTrips = useMemo(() => {
    return [...rejser]
      .sort(
        (a, b) =>
          new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      )
      .slice(0, 5);
  }, [rejser]);

  return (
    <div className="page">
      <div className="card">
        <div className="section-header">
          <div>
            <h1>Dashboard</h1>
            <p className="muted">Overblik over BusPlanen admin.</p>
          </div>

          <button className="btn" onClick={loadDashboard} disabled={loading}>
            {loading ? "Loader..." : "Refresh"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>

      <div className="dashboardStatsGrid">
        <StatCard
          title="Busser"
          value={stats.busCount}
          subtitle="Totalt i systemet"
          onClick={() => navigate("/admin/busser")}
        />

        <StatCard
          title="Rejser"
          value={stats.rejseCount}
          subtitle="Planlagte rejser"
          onClick={() => navigate("/admin/rejser")}
        />

        <StatCard
          title="Bookinger"
          value={stats.bookingCount}
          subtitle="Alle bookinger"
          onClick={() => navigate("/admin/bookings")}
        />

        <StatCard
          title="Aktive bookinger"
          value={stats.activeBookingCount}
          subtitle="Ikke annullerede"
          onClick={() => navigate("/admin/bookings")}
        />
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Kommende rejser</h2>
            <p className="muted">De næste 5 rejser i systemet.</p>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loader rejser...</p>
        ) : newestTrips.length === 0 ? (
          <p className="muted">Ingen rejser fundet.</p>
        ) : (
          <div className="adminTableWrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titel</th>
                  <th>Destination</th>
                  <th>Start</th>
                  <th>Slut</th>
                  <th>Pris</th>
                </tr>
              </thead>
              <tbody>
                {newestTrips.map((rejse) => (
                  <tr key={rejse.rejseId}>
                    <td>#{rejse.rejseId}</td>
                    <td>{rejse.title}</td>
                    <td>{rejse.destination}</td>
                    <td>{formatDate(rejse.startAt)}</td>
                    <td>{formatDate(rejse.endAt)}</td>
                    <td>{rejse.price.toLocaleString("da-DK")} kr.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  subtitle?: string;
  onClick?: () => void;
};

function StatCard({ title, value, subtitle, onClick }: StatCardProps) {
  return (
    <button
      type="button"
      className="card statCard statCardButton"
      onClick={onClick}
    >
      <p className="muted">{title}</p>
      <h2>{value}</h2>
      {subtitle && <p className="muted">{subtitle}</p>}
    </button>
  );
}

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("da-DK", {
    dateStyle: "short",
    timeStyle: "short",
  });
}