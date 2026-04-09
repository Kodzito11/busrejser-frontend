import { useEffect, useMemo, useState } from "react";
import { bookingApi } from "../api/bookingApi";
import AdminBookingTable from "../components/AdminBookingTable";
import { BookingStatus, type BookingListItem } from "../model/booking.types";

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");
      const data = await bookingApi.list();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke hente bookings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleCancel(id: number) {
    const ok = confirm(`Annullér booking #${id}?`);
    if (!ok) return;

    try {
      setBusyId(id);
      await bookingApi.cancel(id);
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke annullere booking.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReactivate(id: number) {
    const ok = confirm(`Genaktiver booking #${id}?`);
    if (!ok) return;

    try {
      setBusyId(id);
      await bookingApi.reactivate(id);
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke genaktivere booking.");
    } finally {
      setBusyId(null);
    }
  }

  const filteredBookings = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return bookings;

    return bookings.filter((b) =>
      [
        b.bookingId,
        b.rejseId,
        b.userId ?? "",
        b.kundeNavn,
        b.kundeEmail,
        b.antalPladser,
        b.role ?? "",
        b.status === BookingStatus.Cancelled ? "annulleret" : "aktiv",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [bookings, query]);

  return (
    <div className="page">
      <div className="card">
        <div className="section-header">
          <div>
            <h1>Bookings</h1>
            <p className="muted">Se og administrér kundebookinger.</p>
          </div>

          <input
            className="input"
            type="text"
            placeholder="Søg på navn, email eller id..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <AdminBookingTable
          bookings={filteredBookings}
          loading={loading}
          actionLoadingId={busyId}
          onCancel={handleCancel}
          onReactivate={handleReactivate}
          emptyMessage="Ingen bookings fundet."
        />
      </div>
    </div>
  );
}
