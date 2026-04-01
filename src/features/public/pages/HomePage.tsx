import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../shared/api/api";
import type { Rejse } from "../../rejse/model/rejse.types";

type HeroSlide = {
  id: number;
  kicker: string;
  title: string;
  text: string;
  image: string;
};

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

const fallbackHeroSlides: HeroSlide[] = [
  {
    id: 1,
    kicker: "",
    title: "Billige ture, dyre minder.",
    text: "Find din næste busrejse hurtigt og enkelt. Oplev Europa med gode priser, stærke ruter og minder der holder længere end turen.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=80",
  },
  {
    id: 2,
    kicker: "",
    title: "Rejs længere. Brug mindre.",
    text: "Kom afsted på ture med karakter, komfort og oplevelser der føles større end prisen.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=80",
  },
  {
    id: 3,
    kicker: "",
    title: "Europa venter.",
    text: "Fra storbyer til kyst og natur. Find næste afgang og gør turen enkel fra start til slut med BusPlanen.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80",
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

function mapRejseToHeroSlide(rejse: Rejse): HeroSlide {
  return {
    id: rejse.rejseId,
    kicker: rejse.destination,
    title: rejse.title,
    text:
      rejse.shortDescription ||
      rejse.description ||
      "Find din næste busrejse hurtigt og enkelt med BusPlanen.",
    image:
      rejse.imageUrl ||
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=80",
  };
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
    image:
      rejse.imageUrl ||
      "https://images.unsplash.com/photo-1502780402662-acc01917f4a1?auto=format&fit=crop&w=1400&q=80",
    isSoldOut: seatsLeft <= 0,
    isLowSeats: seatsLeft > 0 && seatsLeft <= 5,
    seatsLeft,
  };
}

export default function HomePage() {
  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [currentHero, setCurrentHero] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isArrowHovered, setIsArrowHovered] = useState(false);

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

  const heroSlides = useMemo(() => {
    const featured = featuredRejser.map(mapRejseToHeroSlide);
    return featured.length > 0 ? featured : fallbackHeroSlides;
  }, [featuredRejser]);

  const featuredTrips = useMemo(() => {
    return featuredRejser.map(mapRejseToFeaturedTrip);
  }, [featuredRejser]);

  const upcomingTrips = useMemo(() => {
    const featuredIds = new Set(featuredRejser.map((r) => r.rejseId));

    return futureRejser
      .filter((r) => !featuredIds.has(r.rejseId))
      .slice(0, 6);
  }, [futureRejser, featuredRejser]);

  const slide = heroSlides[currentHero] ?? heroSlides[0];

  useEffect(() => {
    if (isPaused || heroSlides.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [isPaused, heroSlides]);

  useEffect(() => {
    if (currentHero >= heroSlides.length) {
      setCurrentHero(0);
    }
  }, [heroSlides, currentHero]);

  const titleClass = useMemo(() => {
    return slide?.title.length > 22 ? "heroTitle heroTitleLong" : "heroTitle";
  }, [slide]);

  function goPrev() {
    setCurrentHero((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  }

  function goNext() {
    setCurrentHero((prev) => (prev + 1) % heroSlides.length);
  }

  function goTo(index: number) {
    setCurrentHero(index);
  }

  if (!slide) return null;

  return (
    <div className="homePage">
      <section className="heroSection">
        <div
          className="heroImage"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.50), rgba(0,0,0,0.18)), url("${slide.image}")`,
          }}
        >
          {heroSlides.length > 1 && (
            <>
              <button
                type="button"
                className="heroArrow heroArrowLeft"
                onClick={goPrev}
                onMouseEnter={() => setIsArrowHovered(true)}
                onMouseLeave={() => setIsArrowHovered(false)}
                aria-label="Forrige slide"
              >
                ‹
              </button>

              <button
                type="button"
                className="heroArrow heroArrowRight"
                onClick={goNext}
                onMouseEnter={() => setIsArrowHovered(true)}
                onMouseLeave={() => setIsArrowHovered(false)}
                aria-label="Næste slide"
              >
                ›
              </button>
            </>
          )}

          <div className="heroOverlay">
            <div className={`heroInner ${isArrowHovered ? "isHidden" : ""}`}>
              <div className="heroContent">
                <p className="heroKicker">{slide.kicker}</p>
                <h1 className={titleClass}>{slide.title}</h1>
                <p className="heroText">{slide.text}</p>
              </div>

              <div className="searchBar" aria-label="Søg rejser">
                <div className="searchItem">
                  <span className="searchLabel">Rejsetype</span>
                  <span className="searchValue">Busrejser</span>
                </div>

                <div className="searchItem">
                  <span className="searchLabel">Destination</span>
                  <span className="searchValue">{slide.kicker || "Europa"}</span>
                </div>

                <div className="searchItem">
                  <span className="searchLabel">Tidspunkt</span>
                  <span className="searchValue">Se kommende afgange</span>
                </div>

                <Link className="searchCta" to="/rejser">
                  Vis rejser
                </Link>
              </div>

              {heroSlides.length > 1 && (
                <div className="heroDots" aria-label="Hero navigation">
                  {heroSlides.map((hero, index) => (
                    <button
                      key={hero.id}
                      type="button"
                      className={`heroDot ${index === currentHero ? "active" : ""}`}
                      onClick={() => goTo(index)}
                      aria-label={`Gå til slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
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
                      →
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
                        →
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