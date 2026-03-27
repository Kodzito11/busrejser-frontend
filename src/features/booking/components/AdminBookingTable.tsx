import { BookingStatus, type BookingListItem } from "../model/booking.types";
import BookingStatusBadge from "./BookingStatusBadge";
import BookingUserTypeBadge from "./BookingUserTypeBadge";

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
            <th>Pris</th>
            <th>Betaling</th>
            <th>Type</th>
            <th>Status</th>
            <th>Oprettet</th>
            <th>Betalt</th>
            <th>Stripe</th>
            <th>Handling</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => {
            const busy = actionLoadingId === b.bookingId;
            const isCancelled = b.status === BookingStatus.Cancelled;

            return (
              <tr key={b.bookingId}>
                <td>#{b.bookingId}</td>
                <td>#{b.rejseId}</td>
                <td>{b.kundeNavn}</td>
                <td>{b.kundeEmail}</td>
                <td>{b.antalPladser}</td>
                <td>{formatPrice(b.totalPrice)}</td>
                <td>
                  <PaymentBadge paidAt={b.paidAt} />
                </td>
                <td>
                  <BookingUserTypeBadge userId={b.userId} role={b.role} />
                </td>
                <td>
                  <BookingStatusBadge status={b.status} />
                </td>
                <td>{formatDateTime(b.createdAt)}</td>
                <td>{formatDateTime(b.paidAt)}</td>
                <td>
                  <div className="adminStripeMeta">
                    <div title={b.stripeSessionId ?? ""}>
                      <strong>Session:</strong> {shortId(b.stripeSessionId)}
                    </div>
                    <div title={b.stripePaymentIntentId ?? ""}>
                      <strong>Intent:</strong> {shortId(b.stripePaymentIntentId)}
                    </div>
                  </div>
                </td>
                <td>
                  {isCancelled ? (
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

function formatDateTime(value?: string | null) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleString("da-DK", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatPrice(value?: number) {
  if (typeof value !== "number") return "-";
  return `${value.toLocaleString("da-DK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kr`;
}

function shortId(value?: string | null) {
  if (!value) return "-";
  if (value.length <= 16) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function PaymentBadge({ paidAt }: { paidAt?: string | null }) {
  const isPaid = !!paidAt;

  return (
    <span className={`paymentBadge ${isPaid ? "paid" : "pending"}`}>
      {isPaid ? "Betalt" : "Afventer"}
    </span>
  );
}