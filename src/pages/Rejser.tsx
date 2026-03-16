import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { Rejse, Bus } from "../api";
import TripCalendar from "../components/TripCalendar";
import { hasRole, isAdmin } from "../auth/auth";

type Form = {
  title: string;
  destination: string;
  startAt: string;
  endAt: string;
  price: number;
  maxSeats: number;
  busId: string;
};

function toIso(dtLocal: string) {
  return dtLocal ? new Date(dtLocal).toISOString() : "";
}

export default function Rejser() {
  const navigate = useNavigate();

  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [availableSeats, setAvailableSeats] = useState<Record<number, number>>(
    {}
  );

  const monthLabel = new Intl.DateTimeFormat("da-DK", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  function prevMonth() {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  const [form, setForm] = useState<Form>({
    title: "",
    destination: "",
    startAt: "",
    endAt: "",
    price: 0,
    maxSeats: 0,
    busId: "",
  });

  const canCreate = useMemo(() => {
    return (
      form.title.trim().length > 0 &&
      form.destination.trim().length > 0 &&
      form.startAt.length > 0 &&
      form.endAt.length > 0
    );
  }, [form]);

  async function refresh() {
    setErr("");
    setLoading(true);

    try {
      const [list, busList] = await Promise.all([
        api.rejser.list(),
        api.buses.list(),
      ]);

      const rejseList = Array.isArray(list) ? list : [];
      setRejser(rejseList);
      setBuses(Array.isArray(busList) ? busList : []);

      const seatEntries = await Promise.all(
        rejseList.map(async (r) => {
          try {
            const seats = await api.bookings.getAvailableSeats(r.rejseId);
            return [r.rejseId, seats] as const;
          } catch {
            return [r.rejseId, r.maxSeats] as const;
          }
        })
      );

      setAvailableSeats(Object.fromEntries(seatEntries));
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function createRejse() {
    if (!canCreate) return;
    setErr("");
    setLoading(true);

    try {
      await api.rejser.create({
        title: form.title,
        destination: form.destination,
        startAt: toIso(form.startAt),
        endAt: toIso(form.endAt),
        price: Number(form.price) || 0,
        maxSeats: Number(form.maxSeats) || 0,
        busId: form.busId ? Number(form.busId) : null,
      });

      setForm({
        title: "",
        destination: "",
        startAt: "",
        endAt: "",
        price: 0,
        maxSeats: 0,
        busId: "",
      });

      await refresh();
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function deleteRejse(id: number) {
    setErr("");
    setLoading(true);

    try {
      await api.rejser.delete(id);
      await refresh();
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const canCreateTrips = hasRole("Admin", "Medarbejder");
  const canDeleteTrips = isAdmin();

  return (
    <div className="wrap">
      <header className="header">
        <div>
          <h1>Rejser</h1>
          <p className="muted">Se kommende rejser og book din plads</p>
        </div>
        <button onClick={refresh} disabled={loading}>
          Refresh
        </button>
      </header>

      {err && <div className="error">{err}</div>}

      <section
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button onClick={prevMonth}>←</button>
        <div style={{ fontWeight: 800, textTransform: "capitalize" }}>
          {monthLabel}
        </div>
        <button onClick={nextMonth}>→</button>
      </section>

      <TripCalendar trips={rejser} currentMonth={currentMonth} />

      {canCreateTrips && (
        <section className="card">
          <h2>Opret rejse</h2>

          <div className="grid">
            <label>
              Titel
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>

            <label>
              Destination
              <input
                value={form.destination}
                onChange={(e) =>
                  setForm({ ...form, destination: e.target.value })
                }
              />
            </label>

            <label>
              Start
              <input
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => setForm({ ...form, startAt: e.target.value })}
              />
            </label>

            <label>
              Slut
              <input
                type="datetime-local"
                value={form.endAt}
                onChange={(e) => setForm({ ...form, endAt: e.target.value })}
              />
            </label>

            <label>
              Pris
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </label>

            <label>
              Max pladser
              <input
                type="number"
                value={form.maxSeats}
                onChange={(e) =>
                  setForm({ ...form, maxSeats: Number(e.target.value) })
                }
              />
            </label>

            <label>
              Bus (valgfri)
              <select
                value={form.busId}
                onChange={(e) => setForm({ ...form, busId: e.target.value })}
              >
                <option value="">Ingen</option>
                {buses.map((b) => (
                  <option key={b.busId} value={b.busId}>
                    {b.registreringnummer} — {b.model}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="row">
            <button onClick={createRejse} disabled={loading || !canCreate}>
              Opret
            </button>
            {!canCreate && (
              <span className="muted">
                Titel + destination + start/slut kræves
              </span>
            )}
          </div>
        </section>
      )}

      <section className="cards">
        <h2>Kommende rejser ({rejser.length})</h2>

        {loading && rejser.length === 0 ? (
          <p className="muted">Loader…</p>
        ) : rejser.length === 0 ? (
          <p className="muted">Ingen rejser endnu.</p>
        ) : (
          <div className="trip-cards">
            {rejser.map((r) => {
              const seatsLeft = availableSeats[r.rejseId] ?? r.maxSeats;

              return (
                <article className="trip-card" key={r.rejseId}>
                  <div className="trip-card-top">
                    <div>
                      <p className="trip-card-id">Rejse #{r.rejseId}</p>
                      <h3>{r.title}</h3>
                      <p className="muted">{r.destination}</p>
                    </div>

                    <div className={`trip-badge ${seatsLeft <= 0 ? "soldout" : ""}`}>
                      {seatsLeft <= 0 ? "Udsolgt" : `${seatsLeft} ledige`}
                    </div>
                  </div>

                  <div className="trip-meta">
                    <div>
                      <span className="muted">Start</span>
                      <strong>{new Date(r.startAt).toLocaleString()}</strong>
                    </div>

                    <div>
                      <span className="muted">Slut</span>
                      <strong>{new Date(r.endAt).toLocaleString()}</strong>
                    </div>

                    <div>
                      <span className="muted">Pris</span>
                      <strong>{r.price} kr</strong>
                    </div>

                    <div>
                      <span className="muted">Bus</span>
                      <strong>{r.busId ?? "-"}</strong>
                    </div>
                  </div>

                  <div className="trip-actions">
                    <button
                      onClick={() => navigate(`/rejse/${r.rejseId}`)}
                      disabled={seatsLeft <= 0}
                    >
                      {seatsLeft <= 0 ? "Udsolgt" : "Se detaljer"}
                    </button>

                    {canDeleteTrips && (
                      <button
                        className="danger"
                        onClick={() => deleteRejse(r.rejseId)}
                        disabled={loading}
                      >
                        Slet
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}