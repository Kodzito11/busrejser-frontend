import type { BookingListItem } from "../model/booking.types";
import BookingStatusBadge from "./BookingStatusBadge";
import BookingUserTypeBadge from "./BookingUserTypeBadge";

export type AdminBookingRow = {
  bookingId: number;
  rejseId: number;
  kundeNavn: string;
  kundeEmail: string;
  antalPladser: number;
  userId: number | null;
  role?: string | null;
  isCancelled: boolean;
  createdAt?: string;
};

type Props = {
  bookings: BookingListItem[];
  loading?: boolean;
  emptyMessage?: string;
  onCancel?: (bookingId: number) => void;
  onReactivate?: (bookingId: number) => void;
  actionLoadingId?: number | null;
};

export default function AdminBookingTable({
  bookings,
  loading = false,
  emptyMessage = "Ingen bookinger fundet.",
  onCancel,
  onReactivate,
  actionLoadingId = null,
}: Props) {
  if (loading) {
    return <p className="muted">Loader bookinger...</p>;
  }

  if (bookings.length === 0) {
    return <p className="muted">{emptyMessage}</p>;
  }

  return (
    <div className="adminTableWrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Rejse</th>
            <th>Navn</th>
            <th>Email</th>
            <th>Pladser</th>
            <th>Type</th>
            <th>Status</th>
            <th>Oprettet</th>
            <th>Handling</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => {
            const busy = actionLoadingId === b.bookingId;

            return (
              <tr key={b.bookingId}>
                <td>#{b.bookingId}</td>
                <td>#{b.rejseId}</td>
                <td>{b.kundeNavn}</td>
                <td>{b.kundeEmail}</td>
                <td>{b.antalPladser}</td>
                <td>
                  <BookingUserTypeBadge userId={b.userId} role={b.role} />
                </td>
                <td>
                  <BookingStatusBadge isCancelled={b.isCancelled} />
                </td>
                <td>{formatDateTime(b.createdAt)}</td>
                <td>
                  {b.isCancelled ? (
                    <button
                      className="adminActionBtn secondary"
                      onClick={() => onReactivate?.(b.bookingId)}
                      disabled={busy}
                    >
                      {busy ? "..." : "Genaktiver"}
                    </button>
                  ) : (
                    <button
                      className="adminActionBtn danger"
                      onClick={() => onCancel?.(b.bookingId)}
                      disabled={busy}
                    >
                      {busy ? "..." : "Annuller"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDateTime(value?: string) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleString("da-DK", {
    dateStyle: "short",
    timeStyle: "short",
  });
}