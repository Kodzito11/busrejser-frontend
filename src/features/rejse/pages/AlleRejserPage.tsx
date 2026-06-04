import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import RejseCardList from "../components/public/RejseCardList";
import RejseFilters from "../components/public/RejseFilters";
import RejserPageNav from "../components/public/RejserPageNav";
import { useRejserData } from "../hooks/useRejserData";
import { useRejserFilters } from "../hooks/useRejserFilters";
import type { PeriodOption } from "../utils/publicRejseFilters";

function getPeriodLabel(period: PeriodOption) {
  switch (period) {
    case "kommende":
      return "kommende afgange";
    case "sommer":
      return "sommer";
    case "efteraar":
      return "efterår";
    case "vinter":
      return "vinter";
    default:
      return "";
  }
}

function getValidPeriod(value: string | null): PeriodOption {
  if (
    value === "kommende" ||
    value === "sommer" ||
    value === "efteraar" ||
    value === "vinter"
  ) {
    return value;
  }

  return "";
}

function getValidPersons(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export default function AlleRejserPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryDestination = searchParams.get("destination") ?? "";
  const queryPeriod = getValidPeriod(searchParams.get("periode"));
  const queryPersons = getValidPersons(searchParams.get("personer"));

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
    period,
    setPeriod,
    persons,
    setPersons,
    destinations,
    visibleRejser,
    hasActiveFilters,
    resetFilters,
  } = useRejserFilters(rejser, availableSeats, {
    initialDestination: queryDestination,
    initialPeriod: queryPeriod,
    initialPersons: queryPersons,
  });

  const featuredRejser = useMemo(
    () => visibleRejser.filter((rejse) => rejse.isFeatured).slice(0, 3),
    [visibleRejser]
  );

  const resultContext = useMemo(() => {
    const parts: string[] = [];

    if (selectedDestination) {
      parts.push(selectedDestination);
    }

    const periodLabel = getPeriodLabel(period);

    if (periodLabel) {
      parts.push(periodLabel);
    }

    if (persons > 1) {
      parts.push(`${persons} personer`);
    }

    return parts.join(" · ");
  }, [selectedDestination, period, persons]);

  return (
    <div className="wrap">
      <section className="hero rejserHero">
        <div>
          <p className="rejserHero__eyebrow">Busrejser</p>
          <h1>Find din næste tur</h1>
          <p className="muted">
            Udforsk kommende afgange, filtrer på destination og gå direkte
            videre til booking, når den rigtige rejse dukker op.
          </p>

          {resultContext && (
            <p className="muted">
              Viser rejser for: <strong>{resultContext}</strong>
            </p>
          )}
        </div>

        <div className="rejserHero__actions">
          <button onClick={() => navigate("/rejser/kalender")} type="button">
            Åbn kalender
          </button>
          <button
            className="ghost"
            onClick={refresh}
            disabled={loading && rejser.length === 0}
          >
            {loading ? "Opdaterer..." : "Opdater rejser"}
          </button>
        </div>
      </section>

      <RejserPageNav />

      {error && <div className="error">{error}</div>}

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
        period={period}
        setPeriod={setPeriod}
        persons={persons}
        setPersons={setPersons}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {featuredRejser.length > 0 && !onlyFeatured && (
        <section className="cards">
          <div className="sectionHeader">
            <div>
              <h2>Featured rejser</h2>
              <p className="muted">
                Et hurtigt overblik over de ture vi fremhæver lige nu.
              </p>
            </div>
          </div>

          <RejseCardList
            rejser={featuredRejser}
            availableSeats={availableSeats}
            loading={loading}
            onOpen={(id) => navigate(`/rejse/${id}`)}
          />
        </section>
      )}

      <section className="cards">
        <div className="sectionHeader">
          <div>
            <h2>Alle kommende rejser ({visibleRejser.length})</h2>
            <p className="muted">
              Browse alle publicerede rejser i klassisk kortoversigt.
            </p>
          </div>
        </div>

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