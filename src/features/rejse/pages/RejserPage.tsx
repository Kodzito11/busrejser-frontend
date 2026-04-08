import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../../shared/api/api";
import type { Rejse } from "../model/rejse.types";
import TripCalendar from "../components/RejseKalender";

type SortOption = "date-asc" | "date-desc" | "price-asc" | "price-desc";

export default function Rejser() {
  const navigate = useNavigate();

  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [availableSeats, setAvailableSeats] = useState<Record<number, number>>(
    {}
  );

  const [search, setSearch] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState<SortOption>("date-asc");

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

  async function refresh() {
    setErr("");
    setLoading(true);

    try {
      const list = await api.rejser.list();
      const rejseList = Array.isArray(list) ? list : [];

      setRejser(rejseList);

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

  useEffect(() => {
    refresh();
  }, []);

  const visibleRejser = useMemo(() => {
    const filtered = rejser.filter((r) => r.isPublished);

    let result = filtered;

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

    return [...result].sort((a, b) => {
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
  }, [rejser, search, onlyAvailable, sort, availableSeats]);

  const hasActiveFilters =
    search.trim().length > 0 || onlyAvailable || sort !== "date-asc";

  return (
    <div className="wrap">
      <header className="header">
        <div>
          <h1>Rejser</h1>
          <p className="muted">Se kommende rejser og book din plads</p>
        </div>

        <button onClick={refresh} disabled={loading && rejser.length === 0}>
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
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
            >
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