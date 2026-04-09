import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import RejseFilters from "../components/public/RejseFilters";
import RejseCardList from "../components/public/RejseCardList";

import { api } from "../../../shared/api/api";
import type { Rejse } from "../model/rejse.types";
import TripCalendar from "../components/RejseKalender";
import { getErrorMessage } from "../../../shared/utils/error";

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
    } catch (error: unknown) {
      setErr(getErrorMessage(error, "Kunne ikke hente rejser."));
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

      <RejseFilters
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <TripCalendar
        trips={visibleRejser}
        currentMonth={currentMonth}
        availableSeats={availableSeats}
        onTripClick={(trip) => navigate(`/rejse/${trip.rejseId}`)}
      />

      <section className="cards">
        <h2>Kommende rejser ({visibleRejser.length})</h2>

        <RejseCardList
          rejser={visibleRejser}
          availableSeats={availableSeats}
          loading={loading}
          onOpen={(id) => navigate(`/rejse/${id}`)}
        />
      </section>
    </div>
  );
}
