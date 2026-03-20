import { getStatusLabel, formatDashboardCurrency, formatDashboardDate } from "../utils/adminDashboardHelpers";
import type { TripInsight } from "../types/adminDashboard.types";

type DashboardUpcomingTripsTableProps = {
  trips: TripInsight[];
  loading?: boolean;
};

export default function DashboardUpcomingTripsTable({
  trips,
  loading = false,
}: DashboardUpcomingTripsTableProps) {
  if (loading) {
    return <p className="muted">Loader rejser...</p>;
  }

  if (trips.length === 0) {
    return <p className="muted">Ingen kommende rejser fundet.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titel</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Start</th>
            <th>Pris</th>
            <th>Belægning</th>
            <th>Omsætning</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((trip) => (
            <tr key={trip.rejseId}>
              <td>#{trip.rejseId}</td>
              <td>{trip.title}</td>
              <td>{trip.destination}</td>
              <td>
                <span className={`statusBadge ${trip.status}`}>
                  {getStatusLabel(trip.status)}
                </span>
              </td>
              <td>{formatDashboardDate(trip.startAt)}</td>
              <td>{formatDashboardCurrency(trip.price)}</td>
              <td>
                <div className="capacity">
                  <div className="capacity-bar">
                    <div
                      className="capacity-fill"
                      style={{ width: `${trip.fillPercent}%` }}
                    />
                  </div>
                  <div className="capacity-text">
                    {trip.activeSeats}/{trip.maxSeats} · {trip.fillPercent}%
                  </div>
                </div>
              </td>
              <td>{formatDashboardCurrency(trip.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}