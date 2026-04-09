import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TripCalendar from "../components/RejseKalender";
import RejseFilters from "../components/public/RejseFilters";
import RejserPageNav from "../components/public/RejserPageNav";
import { useRejserData } from "../hooks/useRejserData";
import { useRejserFilters } from "../hooks/useRejserFilters";

export default function RejseKalenderPage() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const { rejser, availableSeats, loading, error, refresh } = useRejserData();
  const {
    search,
    setSearch,
    sort,
    setSort,
    onlyAvailable,
    setOnlyAvailable,
    selectedDestination,
    setSelectedDestination,
    onlyFeatured,
    setOnlyFeatured,
    destinations,
    visibleRejser,
    hasActiveFilters,
    resetFilters,
  } = useRejserFilters(rejser, availableSeats);

  const monthLabel = new Intl.DateTimeFormat("da-DK", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  function prevMonth() {
    setCurrentMonth((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }

  return (
    <div className="wrap">
      <section className="hero rejserHero">
        <div>
          <p className="rejserHero__eyebrow">Planlægning</p>
          <h1>Se rejserne i kalender</h1>
          <p className="muted">
            Brug kalenderen til at finde roligere afrejsedage, sammenligne datoer
            og se hvilke ture der stadig har ledige pladser.
          </p>
        </div>

        <div className="rejserHero__actions">
          <button className="ghost" onClick={refresh} disabled={loading && rejser.length === 0}>
            {loading ? "Opdaterer..." : "Opdater rejser"}
          </button>
        </div>
      </section>

      <RejserPageNav />

      {error && <div className="error">{error}</div>}

      <section className="card rejserMonthBar">
        <button onClick={prevMonth} type="button">
          Forrige
        </button>

        <div className="rejserMonthBar__label">{monthLabel}</div>

        <button onClick={nextMonth} type="button">
          Næste
        </button>
      </section>

      <RejseFilters
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
        destinations={destinations}
        selectedDestination={selectedDestination}
        setSelectedDestination={setSelectedDestination}
        onlyFeatured={onlyFeatured}
        setOnlyFeatured={setOnlyFeatured}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <TripCalendar
        trips={visibleRejser}
        currentMonth={currentMonth}
        availableSeats={availableSeats}
        onTripClick={(trip) => navigate(`/rejse/${trip.rejseId}`)}
      />
    </div>
  );
}
