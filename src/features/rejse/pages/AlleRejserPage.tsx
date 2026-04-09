import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import RejseCardList from "../components/public/RejseCardList";
import RejseFilters from "../components/public/RejseFilters";
import RejserPageNav from "../components/public/RejserPageNav";
import { useRejserData } from "../hooks/useRejserData";
import { useRejserFilters } from "../hooks/useRejserFilters";

export default function AlleRejserPage() {
  const navigate = useNavigate();
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

  const featuredRejser = useMemo(
    () => visibleRejser.filter((rejse) => rejse.isFeatured).slice(0, 3),
    [visibleRejser]
  );

  return (
    <div className="wrap">
      <section className="hero rejserHero">
        <div>
          <p className="rejserHero__eyebrow">Busrejser</p>
          <h1>Find din næste tur</h1>
          <p className="muted">
            Udforsk kommende afgange, filtrer på destination og gå direkte videre
            til booking, når den rigtige rejse dukker op.
          </p>
        </div>

        <div className="rejserHero__actions">
          <button onClick={() => navigate("/rejser/kalender")} type="button">
            Åbn kalender
          </button>
          <button className="ghost" onClick={refresh} disabled={loading && rejser.length === 0}>
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
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {featuredRejser.length > 0 && !onlyFeatured && (
        <section className="cards">
          <div className="sectionHeader">
            <div>
              <h2>Featured rejser</h2>
              <p className="muted">Et hurtigt overblik over de ture vi fremhæver lige nu.</p>
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
            <p className="muted">Browse alle publicerede rejser i klassisk kortoversigt.</p>
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
