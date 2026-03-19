import { useEffect, useMemo, useState } from "react";
import { bookingApi } from "../api/bookingApi";
import { BookingStatus, type Booking } from "../model/booking.types";

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
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
        b.bookingReference,
        b.kundeNavn,
        b.kundeEmail,
        b.antalPladser,
        b.status === BookingStatus.Cancelled ? "Annulleret" : "Aktiv",
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
            placeholder="Søg på navn, email, reference eller id..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p className="muted">Loader bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p className="muted">Ingen bookings fundet.</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ref</th>
                  <th>Navn</th>
                  <th>Email</th>
                  <th>Rejse</th>
                  <th>Pladser</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Handling</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => {
                  const isCancelled = b.status === BookingStatus.Cancelled;

                  return (
                    <tr key={b.bookingId}>
                      <td>#{b.bookingId}</td>
                      <td>{b.bookingReference}</td>
                      <td>{b.kundeNavn}</td>
                      <td>{b.kundeEmail}</td>
                      <td>#{b.rejseId}</td>
                      <td>{b.antalPladser}</td>
                      <td>{b.userId == null ? "Gæst" : b.role ?? "Bruger"}</td>
                      <td>{isCancelled ? "Annulleret" : "Aktiv"}</td>
                      <td>
                        {isCancelled ? (
                          <button
                            className="btn"
                            type="button"
                            disabled={busyId === b.bookingId}
                            onClick={() => handleReactivate(b.bookingId)}
                          >
                            {busyId === b.bookingId ? "Arbejder..." : "Genaktiver"}
                          </button>
                        ) : (
                          <button
                            className="btn danger"
                            type="button"
                            disabled={busyId === b.bookingId}
                            onClick={() => handleCancel(b.bookingId)}
                          >
                            {busyId === b.bookingId ? "Arbejder..." : "Annullér"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}