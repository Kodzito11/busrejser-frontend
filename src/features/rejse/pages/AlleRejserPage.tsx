import { useNavigate, useSearchParams } from "react-router-dom";

import RejseCardList from "../components/public/RejseCardList";
import RejseFilters from "../components/public/RejseFilters";
import RejserPageNav from "../components/public/RejserPageNav";
import { useRejserData } from "../hooks/useRejserData";
import { useRejserFilters } from "../hooks/useRejserFilters";
import type { PeriodOption } from "../utils/publicRejseFilters";

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

  const { rejser, availableSeats, loading, error } = useRejserData();

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

  const featuredRejser = visibleRejser
    .filter((rejse) => rejse.isFeatured)
    .slice(0, 3);

  return (
    <div className="wrap rejserOverviewPage">
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

      <section className="cards rejserAllSection">
          <div className="sectionHeader">
            <div>
              <h2>Alle kommende rejser ({visibleRejser.length})</h2>
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
