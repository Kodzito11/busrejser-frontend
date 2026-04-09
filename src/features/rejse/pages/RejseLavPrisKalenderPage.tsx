import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import RejseFilters from "../components/public/RejseFilters";
import RejserPageNav from "../components/public/RejserPageNav";
import { useRejserData } from "../hooks/useRejserData";
import { useRejserFilters } from "../hooks/useRejserFilters";
import {
  getSeatsLeft,
  groupTripsByDestination,
} from "../utils/publicRejseFilters";

export default function RejseLavPrisKalenderPage() {
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
  } = useRejserFilters(rejser, availableSeats, { initialSort: "price-asc" });

  const groupedTrips = useMemo(
    () => groupTripsByDestination(visibleRejser),
    [visibleRejser]
  );

  const cheapestTrips = visibleRejser.slice(0, 3);

  return (
    <div className="wrap">
      <section className="hero rejserHero">
        <div>
          <p className="rejserHero__eyebrow">Lavpris</p>
          <h1>Find de billigste rejser først</h1>
          <p className="muted">
            Denne visning prioriterer prisjagt: hurtig scanning, laveste startpris
            og kompakte grupper pr. destination.
          </p>
        </div>

        <div className="rejserHero__actions">
          <button onClick={() => navigate("/rejser")} type="button">
            Se alle rejser
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

      {cheapestTrips.length > 0 && (
        <section className="lavprisSpotlight">
          {cheapestTrips.map((trip, index) => {
            const seatsLeft = getSeatsLeft(trip, availableSeats);

            return (
              <article key={trip.rejseId} className="lavprisSpotlight__card">
                <div className="lavprisSpotlight__rank">#{index + 1}</div>
                <div>
                  <p className="lavprisSpotlight__destination">{trip.destination}</p>
                  <h2>{trip.title}</h2>
                  <p className="muted">
                    {new Date(trip.startAt).toLocaleDateString("da-DK")} - {seatsLeft} ledige
                  </p>
                </div>
                <div className="lavprisSpotlight__price">{trip.price} kr</div>
                <button type="button" onClick={() => navigate(`/rejse/${trip.rejseId}`)}>
                  Se rejse
                </button>
              </article>
            );
          })}
        </section>
      )}

      <section className="lavprisBoard">
        <div className="sectionHeader">
          <div>
            <h2>Lavprisoversigt ({visibleRejser.length})</h2>
            <p className="muted">Grupperet efter destination med laveste pris først.</p>
          </div>
        </div>

        {groupedTrips.length === 0 ? (
          <p className="muted">Ingen rejser matcher din søgning eller filter.</p>
        ) : (
          <div className="lavprisBoard__groups">
            {groupedTrips.map((group) => (
              <section key={group.destination} className="lavprisGroup card">
                <div className="lavprisGroup__header">
                  <div>
                    <p className="lavprisGroup__eyebrow">Destination</p>
                    <h3>{group.destination}</h3>
                  </div>
                  <div className="lavprisGroup__fromPrice">Fra {group.fromPrice} kr</div>
                </div>

                <div className="lavprisGroup__list">
                  {group.trips.map((trip) => {
                    const seatsLeft = getSeatsLeft(trip, availableSeats);

                    return (
                      <button
                        key={trip.rejseId}
                        type="button"
                        className="lavprisTripRow"
                        onClick={() => navigate(`/rejse/${trip.rejseId}`)}
                      >
                        <div className="lavprisTripRow__main">
                          <strong>{trip.title}</strong>
                          <span className="muted">
                            {new Date(trip.startAt).toLocaleDateString("da-DK")} - {seatsLeft} ledige
                          </span>
                        </div>

                        <div className="lavprisTripRow__meta">
                          {trip.isFeatured && (
                            <span className="lavprisTripRow__featured">Featured</span>
                          )}
                          <strong>{trip.price} kr</strong>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
