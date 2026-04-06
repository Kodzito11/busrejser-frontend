import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../../shared/api/api";
import { getCurrentUser } from "../../../features/auth/utils/auth.storage";
import {
  BookingStatus,
  type Booking,
  type BookingStatusType,
} from "../../booking/model/booking.types";
import type { Rejse } from "../../rejse/model/rejse.types";

type BookingWithTrip = Booking & {
  rejse?: Rejse | null;
};

export default function KundeDashboardPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [bookings, setBookings] = useState<BookingWithTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState("");

  async function load(isRefresh = false) {
    setErr("");

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const mine = await api.bookings.mine();

      const enriched = await Promise.all(
        mine.map(async (b) => {
          try {
            const rejse = await api.rejser.get(b.rejseId);
            return { ...b, rejse };
          } catch {
            return { ...b, rejse: null };
          }
        })
      );

      setBookings(enriched);
    } catch (e: any) {
      setErr(e?.message ?? "Kunne ikke hente dashboard.");
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    if (user.role !== "Kunde") {
      navigate("/", { replace: true });
      return;
    }

    load();
  }, [navigate]);

  const activeBookings = useMemo(
    () => bookings.filter((b) => b.status === BookingStatus.Paid),
    [bookings]
  );

  const cancelledBookings = useMemo(
    () => bookings.filter((b) => b.status === BookingStatus.Cancelled),
    [bookings]
  );

  const upcomingBookings = useMemo(() => {
    const now = new Date();

    return activeBookings
      .filter((b) => b.rejse?.startAt && new Date(b.rejse.startAt) > now)
      .sort(
        (a, b) =>
          new Date(a.rejse!.startAt).getTime() -
          new Date(b.rejse!.startAt).getTime()
      );
  }, [activeBookings]);

  const nextBooking = upcomingBookings[0] ?? null;

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return bDate - aDate;
      })
      .slice(0, 3);
  }, [bookings]);

  function formatDate(value?: string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleString("da-DK");
  }

  function getStatusText(status: BookingStatusType) {
    switch (status) {
      case BookingStatus.Paid:
        return "Betalt";
      case BookingStatus.Cancelled:
        return "Annulleret";
      case BookingStatus.Pending:
        return "Afventer";
      case BookingStatus.PaymentFailed:
        return "Betaling fejlet";
      default:
        return "Ukendt";
    }
  }

  function getStatusClass(status: BookingStatusType) {
    switch (status) {
      case BookingStatus.Paid:
        return "status-active";
      case BookingStatus.Cancelled:
        return "status-cancelled";
      case BookingStatus.Pending:
        return "status-pending";
      case BookingStatus.PaymentFailed:
        return "status-failed";
      default:
        return "";
    }
  }

  if (!currentUser) return null;

  return (
    <div className="wrap">
      <header className="header">
        <div>
          <h1>Velkommen tilbage, {currentUser.username}</h1>
          <p className="muted">
            Her er dit overblik over dine rejser og bookinger.
          </p>
        </div>

        <button onClick={() => load(true)} disabled={refreshing}>
          {refreshing ? "Genindlæser..." : "Genindlæs"}
        </button>
      </header>

      <br />

      {err && <div className="error">{err}</div>}

      <section
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        <div className="card">
          <p className="muted">Aktive bookinger</p>
          <h2>{activeBookings.length}</h2>
        </div>

        <div className="card">
          <p className="muted">Annullerede</p>
          <h2>{cancelledBookings.length}</h2>
        </div>

        <div className="card">
          <p className="muted">Næste rejse</p>
          <h2>{nextBooking?.rejse?.destination ?? "-"}</h2>
          <p className="muted">
            {nextBooking?.rejse?.startAt
              ? formatDate(nextBooking.rejse.startAt)
              : "Ingen kommende rejser"}
          </p>
        </div>
      </section>

      <br />

      <section className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <h2>Næste rejse</h2>
            <p className="muted">Din nærmeste kommende booking</p>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loader...</p>
        ) : !nextBooking ? (
          <p className="muted">Du har ingen kommende rejser lige nu.</p>
        ) : (
          <div className="grid" style={{ marginTop: 12 }}>
            <div>
              <strong>Rejse</strong>
              <div>{nextBooking.rejse?.title ?? `Rejse #${nextBooking.rejseId}`}</div>
            </div>

            <div>
              <strong>Destination</strong>
              <div>{nextBooking.rejse?.destination ?? "-"}</div>
            </div>

            <div>
              <strong>Start</strong>
              <div>{formatDate(nextBooking.rejse?.startAt)}</div>
            </div>

            <div>
              <strong>Pladser</strong>
              <div>{nextBooking.antalPladser}</div>
            </div>

            <div>
              <strong>Reference</strong>
              <div>{nextBooking.bookingReference}</div>
            </div>

            <div>
              <strong>Status</strong>
              <div className={getStatusClass(nextBooking.status)}>
                {getStatusText(nextBooking.status)}
              </div>
            </div>
          </div>
        )}
      </section>

      <br />

      <section className="card">
        <h2>Hurtige handlinger</h2>
        <p className="muted">Gå hurtigt videre til det vigtigste.</p>

        <div className="row" style={{ marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={() => navigate("/mine-bookinger")}>
            Se mine bookinger
          </button>

          <button className="ghost" onClick={() => navigate("/rejser")}>
            Find nye rejser
          </button>
        </div>
      </section>

      <br />

      <section className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <h2>Seneste bookinger</h2>
            <p className="muted">Dine 3 nyeste bookinger</p>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loader...</p>
        ) : recentBookings.length === 0 ? (
          <p className="muted">Du har ingen bookinger endnu.</p>
        ) : (
          <>
            {refreshing && (
              <p className="muted" style={{ marginBottom: 12 }}>
                Opdaterer...
              </p>
            )}

            <div className="table">
              <div className="tr head mine-bookinger">
                <div>Reference</div>
                <div>Rejse</div>
                <div>Destination</div>
                <div>Start</div>
                <div>Status</div>
                <div>Pladser</div>
                <div>Handling</div>
              </div>

              {recentBookings.map((b) => (
                <div className="tr mine-bookinger" key={b.bookingId}>
                  <div>{b.bookingReference}</div>
                  <div>{b.rejse?.title ?? `Rejse #${b.rejseId}`}</div>
                  <div>{b.rejse?.destination ?? "-"}</div>
                  <div>{formatDate(b.rejse?.startAt)}</div>
                  <div className={getStatusClass(b.status)}>
                    {getStatusText(b.status)}
                  </div>
                  <div>{b.antalPladser}</div>
                  <div>
                    <button onClick={() => navigate("/mine-bookinger")}>
                      Se mere
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}