import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../../shared/api/api";
import type { Rejse, RejseCreate } from "../model/rejse.types";
import type { Bus } from "../../bus/model/bus.types";
import TripCalendar from "../components/RejseKalender";
import { hasRole, isAdmin } from "../../../features/auth/utils/auth.storage";

type Form = {
  title: string;
  destination: string;
  startAt: string;
  endAt: string;
  price: number;
  maxSeats: number;
  busId: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
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

  const [search, setSearch] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState("date-asc");

  const [form, setForm] = useState<Form>({
    title: "",
    destination: "",
    startAt: "",
    endAt: "",
    price: 0,
    maxSeats: 0,
    busId: "",
    shortDescription: "",
    description: "",
    imageUrl: "",
    isFeatured: false,
    isPublished: false,
  });

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

  function resetFilters() {
    setSearch("");
    setOnlyAvailable(false);
    setSort("date-asc");
  }

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
      const payload: RejseCreate = {
        title: form.title,
        destination: form.destination,
        startAt: toIso(form.startAt),
        endAt: toIso(form.endAt),
        price: Number(form.price) || 0,
        maxSeats: Number(form.maxSeats) || 0,
        busId: form.busId ? Number(form.busId) : 0,
        shortDescription: form.shortDescription || undefined,
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
      };

      await api.rejser.create(payload);

      setForm({
        title: "",
        destination: "",
        startAt: "",
        endAt: "",
        price: 0,
        maxSeats: 0,
        busId: "",
        shortDescription: "",
        description: "",
        imageUrl: "",
        isFeatured: false,
        isPublished: false,
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

  const visibleRejser = useMemo(() => {
    let result = rejser.filter((r) => r.isPublished);

    if (search.trim()) {
      const s = search.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(s) ||
          r.destination.toLowerCase().includes(s)
      );
    }

    if (onlyAvailable) {
      result = result.filter((r) => {
        const seatsLeft = availableSeats[r.rejseId] ?? r.maxSeats;
        return seatsLeft > 0;
      });
    }

    result.sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
        case "date-desc":
          return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return result;
  }, [rejser, search, onlyAvailable, sort, availableSeats]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    onlyAvailable ||
    sort !== "date-asc";

  return (
    <div className="wrap">
      <header className="header">
        <div>
          <h1>Rejser</h1>
          <p className="muted">Se kommende rejser og book din plads</p>
        </div>
        <button onClick={refresh} disabled={loading}>
          {loading ? "Opdaterer..." : "Refresh"}
        </button>
      </header>

      {err && <div className="error">{err}</div>}

      <section
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <button onClick={prevMonth} type="button">
          ← Forrige
        </button>

        <div style={{ fontWeight: 800, textTransform: "capitalize" }}>
          {monthLabel}
        </div>

        <button onClick={nextMonth} type="button">
          Næste →
        </button>
      </section>

      <section className="card">
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            alignItems: "end",
          }}
        >
          <label>
            Søg
            <input
              type="text"
              placeholder="Søg på titel eller destination"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <label>
            Sortering
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="date-asc">Tidligste afgang</option>
              <option value="date-desc">Seneste afgang</option>
              <option value="price-asc">Billigste</option>
              <option value="price-desc">Dyreste</option>
            </select>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              minHeight: "42px",
            }}
          >
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            Kun ledige pladser
          </label>

          <div>
            <button
              type="button"
              className="ghost"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
            >
              Nulstil filtre
            </button>
          </div>
        </div>
      </section>

      <TripCalendar
        trips={visibleRejser}
        currentMonth={currentMonth}
        availableSeats={availableSeats}
        onTripClick={(trip) => navigate(`/rejse/${trip.rejseId}`)}
      />

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

            <label>
              Kort beskrivelse
              <input
                value={form.shortDescription}
                onChange={(e) =>
                  setForm({ ...form, shortDescription: e.target.value })
                }
              />
            </label>

            <label>
              Beskrivelse
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>

            <label>
              Billede URL
              <input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm({ ...form, imageUrl: e.target.value })
                }
              />
            </label>

            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({ ...form, isFeatured: e.target.checked })
                }
              />
              Featured
            </label>

            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm({ ...form, isPublished: e.target.checked })
                }
              />
              Publiceret
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
        <h2>Kommende rejser ({visibleRejser.length})</h2>

        {loading && visibleRejser.length === 0 ? (
          <p className="muted">Loader rejser...</p>
        ) : visibleRejser.length === 0 ? (
          <p className="muted">Ingen rejser matcher din søgning eller filter.</p>
        ) : (
          <div className="trip-cards">
            {visibleRejser.map((r) => {
              const seatsLeft = availableSeats[r.rejseId] ?? r.maxSeats;

              return (
                <article className="trip-card" key={r.rejseId}>
                  {r.imageUrl && (
                    <div
                      style={{
                        height: "150px",
                        backgroundImage: `url(${r.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "12px 12px 0 0",
                        marginBottom: "1rem",
                      }}
                    />
                  )}

                  <div className="trip-card-top">
                    <div>
                      <p className="trip-card-id">Rejse #{r.rejseId}</p>
                      <h3>{r.title}</h3>
                      <p className="muted">{r.destination}</p>
                      {r.shortDescription && <p>{r.shortDescription}</p>}
                    </div>

                    <div
                      className={`trip-badge ${seatsLeft <= 0 ? "soldout" : ""}`}
                    >
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