import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../../../shared/api/api";
import type { Rejse } from "../../rejse/model/rejse.types";

type FeaturedTrip = {
  id: number;
  country: string;
  title: string;
  text: string;
  price: string;
  image: string;
  isSoldOut: boolean;
  isLowSeats: boolean;
  seatsLeft: number;
};

type ValueCard = {
  title: string;
  text: string;
};

const fallbackHeroImage =
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2200&q=80";

const valueCards: ValueCard[] = [
  {
    title: "Udvalgte rejser",
    text: "Se kommende busture og oplevelser samlet ét sted.",
  },
  {
    title: "Nem booking",
    text: "Reserver din plads hurtigt og få overblik over din booking.",
  },
  {
    title: "Fællesskab på vejen",
    text: "Rejs sammen til events, oplevelser og ture.",
  },
  {
    title: "Overblik fra start til slut",
    text: "Følg dine bookinger, status og kommende afgange.",
  },
];

function formatPrice(price: number) {
  return `${price.toLocaleString("da-DK")} kr`;
}

function getSeatsLeft(rejse: Rejse) {
  return Math.max(0, rejse.maxSeats - (rejse.bookedSeats ?? 0));
}

function isSoldOut(rejse: Rejse) {
  return getSeatsLeft(rejse) <= 0;
}

function isLowSeats(rejse: Rejse) {
  const seatsLeft = getSeatsLeft(rejse);
  return seatsLeft > 0 && seatsLeft <= 5;
}

function mapRejseToFeaturedTrip(rejse: Rejse): FeaturedTrip {
  const seatsLeft = getSeatsLeft(rejse);

  return {
    id: rejse.rejseId,
    country: rejse.destination,
    title: rejse.title,
    text:
      rejse.shortDescription ||
      rejse.description ||
      "Oplev en tur med gode priser og stærke minder.",
    price: formatPrice(rejse.price),
    image: rejse.imageUrl || fallbackHeroImage,
    isSoldOut: seatsLeft <= 0,
    isLowSeats: seatsLeft > 0 && seatsLeft <= 5,
    seatsLeft,
  };
}

export default function HomePage() {
  const navigate = useNavigate();
  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [passengerCount, setPassengerCount] = useState("1");

  useEffect(() => {
    async function load() {
      try {
        const data = await api.rejser.list();
        setRejser(data.filter((r) => r.isPublished));
      } catch {
        setRejser([]);
      }
    }

    load();
  }, []);

  const futureRejser = useMemo(() => {
    const now = new Date().getTime();

    return [...rejser]
      .filter((r) => new Date(r.startAt).getTime() >= now)
      .sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      );
  }, [rejser]);

  const featuredRejser = useMemo(() => {
    const featured = futureRejser.filter((r) => r.isFeatured).slice(0, 3);

    if (featured.length > 0) return featured;

    return futureRejser.slice(0, 3);
  }, [futureRejser]);

  const featuredTrips = useMemo(() => {
    return featuredRejser.map(mapRejseToFeaturedTrip);
  }, [featuredRejser]);

  const upcomingTrips = useMemo(() => {
    const featuredIds = new Set(featuredRejser.map((r) => r.rejseId));

    return futureRejser
      .filter((r) => !featuredIds.has(r.rejseId))
      .slice(0, 6);
  }, [futureRejser, featuredRejser]);

  const heroImage = featuredRejser[0]?.imageUrl || fallbackHeroImage;

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/rejser");
  }

  return (
    <div className="homePage">
      <section className="heroSection">
        <div
          className="heroImage"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(7, 20, 44, 0.86), rgba(7, 20, 44, 0.54), rgba(7, 20, 44, 0.24)), url("${heroImage}")`,
          }}
        >
          <div className="heroOverlay">
            <div className="heroInner">
              <div className="heroContent">
                <p className="heroKicker">BusPlanen</p>
                <h1 className="heroTitle">Billige ture, dyre minder</h1>
                <p className="heroText">
                  Find planlagte busture, events og fællesrejser samlet ét sted.
                </p>
              </div>

              <form
                className="searchBar"
                aria-label="Find din næste rejse"
                onSubmit={handleSearchSubmit}
              >
                <div className="searchHeading">
                  <span className="searchEyebrow">Find din næste rejse</span>
                </div>

                <label className="searchItem">
                  <span className="searchLabel">
                    Søg efter destination, event eller rejse
                  </span>
                  <input
                    className="searchInput"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Fx Prag, koncert eller sommer"
                  />
                </label>

                <label className="searchItem">
                  <span className="searchLabel">Dato</span>
                  <input
                    className="searchInput"
                    type="date"
                    value={travelDate}
                    onChange={(event) => setTravelDate(event.target.value)}
                  />
                </label>

                <label className="searchItem">
                  <span className="searchLabel">Antal personer</span>
                  <select
                    className="searchInput"
                    value={passengerCount}
                    onChange={(event) => setPassengerCount(event.target.value)}
                  >
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <option key={count} value={String(count)}>
                        {count} {count === 1 ? "person" : "personer"}
                      </option>
                    ))}
                  </select>
                </label>

                <button className="searchCta" type="submit">
                  Søg rejser
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="valueSection" aria-label="Fordele ved BusPlanen">
        <div className="valueGrid">
          {valueCards.map((card) => (
            <article className="valueCard" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="homeSection">
        <div className="sectionTop">
          <h2>Aktuelle rejser</h2>
          <Link to="/rejser" className="sectionLink">
            Se alle
          </Link>
        </div>

        <div className="tripGrid">
          {featuredTrips.length > 0 ? (
            featuredTrips.map((trip) => (
              <article className="tripCard" key={trip.id}>
                <div
                  className="tripImage"
                  style={{ backgroundImage: `url("${trip.image}")` }}
                >
                  <span className="tripBadge">{trip.country}</span>

                  {trip.isSoldOut && (
                    <span className="tripBadge" style={{ right: 12, left: "auto" }}>
                      Udsolgt
                    </span>
                  )}

                  {!trip.isSoldOut && trip.isLowSeats && (
                    <span className="tripBadge" style={{ right: 12, left: "auto" }}>
                      Kun {trip.seatsLeft} pladser tilbage
                    </span>
                  )}
                </div>

                <div className="tripBody">
                  <h3>{trip.title}</h3>
                  <p>{trip.text}</p>

                  <div className="tripBottom">
                    <strong>{trip.price}</strong>
                    <Link
                      to={`/rejse/${trip.id}`}
                      className="tripArrow"
                      aria-label={`Se mere om ${trip.title}`}
                    >
                      {"\u2192"}
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p>Ingen aktuelle rejser endnu.</p>
          )}
        </div>
      </section>

      <section className="homeSection">
        <div className="sectionTop">
          <h2>Næste afgange</h2>
        </div>

        <div className="tripGrid">
          {upcomingTrips.length > 0 ? (
            upcomingTrips.map((r) => {
              const soldOut = isSoldOut(r);
              const lowSeats = isLowSeats(r);
              const seatsLeft = getSeatsLeft(r);

              return (
                <article className="tripCard" key={r.rejseId}>
                  {r.imageUrl && (
                    <div
                      className="tripImage"
                      style={{ backgroundImage: `url("${r.imageUrl}")` }}
                    >
                      {soldOut && (
                        <span className="tripBadge" style={{ right: 12, left: "auto" }}>
                          Udsolgt
                        </span>
                      )}

                      {!soldOut && lowSeats && (
                        <span className="tripBadge" style={{ right: 12, left: "auto" }}>
                          Kun {seatsLeft} tilbage
                        </span>
                      )}
                    </div>
                  )}

                  <div className="tripBody">
                    <h3>{r.title}</h3>
                    <p>{r.destination}</p>

                    <p className="muted">
                      {new Date(r.startAt).toLocaleDateString("da-DK")}
                    </p>

                    <div className="tripBottom">
                      <strong>{r.price.toLocaleString("da-DK")} kr</strong>
                      <Link to={`/rejse/${r.rejseId}`} className="tripArrow">
                        {"\u2192"}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p>Ingen flere kommende afgange lige nu.</p>
          )}
        </div>
      </section>
    </div>
  );
}
