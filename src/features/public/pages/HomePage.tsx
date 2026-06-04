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
    kicker: "BusPlanen",
    title: "Billige ture, dyre minder.",
    text: "Find din næste busrejse hurtigt og enkelt. Oplev Europa med gode priser, stærke rejser og minder der holder længere end turen.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=80",
  },
  {
    id: 2,
    kicker: "Næste oplevelse",
    title: "Rejs længere. Brug mindre.",
    text: "Kom afsted på rejser med karakter, komfort og oplevelser der føles større end prisen.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=80",
  },
  {
    id: 3,
    kicker: "Europa",
    title: "Europa venter.",
    text: "Fra storbyer til kyst og natur. Find næste afgang og gør rejsen enkel fra start til slut med BusPlanen.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80",
  },
];

const fallbackTripImage =
  "https://images.unsplash.com/photo-1502780402662-acc01917f4a1?auto=format&fit=crop&w=1400&q=80";

function formatPrice(price: number) {
  return `${price.toLocaleString("da-DK")} kr`;
}

function getTime(value: string) {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
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

function isVisiblePublicRejse(rejse: Rejse) {
  return rejse.isPublished !== false;
}

function isFutureRejse(rejse: Rejse) {
  return getTime(rejse.startAt) >= Date.now();
}

function sortByStartDate(a: Rejse, b: Rejse) {
  return getTime(a.startAt) - getTime(b.startAt);
}

function getDescription(rejse: Rejse, fallback: string) {
  return rejse.shortDescription || rejse.description || fallback;
}

function getImage(rejse: Rejse, fallback = fallbackTripImage) {
  return rejse.imageUrl || fallback;
}

function mapRejseToHeroSlide(rejse: Rejse): HeroSlide {
  return {
    id: rejse.rejseId,
    kicker: rejse.destination,
    title: rejse.title,
    text: getDescription(
      rejse,
      "Find din næste busrejse hurtigt og enkelt med BusPlanen."
    ),
    image: getImage(
      rejse,
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=80"
    ),
  };
}

function mapRejseToFeaturedTrip(rejse: Rejse): FeaturedTrip {
  const seatsLeft = getSeatsLeft(rejse);

  return {
    id: rejse.rejseId,
    country: rejse.destination,
    title: rejse.title,
    text: getDescription(
      rejse,
      "Oplev en rejse med gode priser og stærke minder."
    ),
    price: formatPrice(rejse.price),
    image: getImage(rejse),
    isSoldOut: seatsLeft <= 0,
    isLowSeats: seatsLeft > 0 && seatsLeft <= 5,
    seatsLeft,
  };
}

export default function HomePage() {
  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  const [currentHero, setCurrentHero] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHeroControlsHovered, setIsHeroControlsHovered] = useState(false);

  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("kommende");
  const [persons, setPersons] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function loadRejser() {
      try {
        setIsLoading(true);
        setHasLoadError(false);

        const data = await api.rejser.list();

        if (!isMounted) return;

        setRejser(data.filter(isVisiblePublicRejse));
      } catch {
        if (!isMounted) return;

        setRejser([]);
        setHasLoadError(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRejser();

    return () => {
      isMounted = false;
    };
  }, []);

  const futureRejser = useMemo(() => {
    return [...rejser].filter(isFutureRejse).sort(sortByStartDate);
  }, [rejser]);

  const destinationOptions = useMemo(() => {
    return [
      ...new Set(futureRejser.map((r) => r.destination).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b, "da-DK"));
  }, [futureRejser]);

  const featuredRejser = useMemo(() => {
    const featured = futureRejser.filter((r) => r.isFeatured).slice(0, 3);

    if (featured.length > 0) return featured;

    return futureRejser.slice(0, 3);
  }, [futureRejser]);

  const heroSlides = useMemo(() => {
    const heroRejser =
      featuredRejser.length >= 2 ? featuredRejser : futureRejser.slice(0, 3);

    const slides = heroRejser.map(mapRejseToHeroSlide);

    if (slides.length >= 2) return slides;

    if (slides.length === 1) {
      return [
        slides[0],
        ...fallbackHeroSlides.map((slide) => ({
          ...slide,
          id: -slide.id,
        })),
      ];
    }

    return fallbackHeroSlides;
  }, [featuredRejser, futureRejser]);

  const featuredTrips = useMemo(() => {
    return featuredRejser.map(mapRejseToFeaturedTrip);
  }, [featuredRejser]);

  const upcomingTrips = useMemo(() => {
    const featuredIds = new Set(featuredRejser.map((r) => r.rejseId));

    return futureRejser
      .filter((r) => !featuredIds.has(r.rejseId))
      .slice(0, 6);
  }, [futureRejser, featuredRejser]);

  const searchHref = useMemo(() => {
    const params = new URLSearchParams();

    if (selectedDestination) {
      params.set("destination", selectedDestination);
    }

    if (selectedPeriod) {
      params.set("periode", selectedPeriod);
    }

    if (persons > 1) {
      params.set("personer", String(persons));
    }

    const query = params.toString();

    return query ? `/rejser?${query}` : "/rejser";
  }, [selectedDestination, selectedPeriod, persons]);

  const slide = heroSlides[currentHero] ?? heroSlides[0];

  useEffect(() => {
    if (isPaused || heroSlides.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [isPaused, heroSlides.length]);

  useEffect(() => {
    if (currentHero >= heroSlides.length) {
      setCurrentHero(0);
    }
  }, [heroSlides.length, currentHero]);

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
                onMouseEnter={() => setIsHeroControlsHovered(true)}
                onMouseLeave={() => setIsHeroControlsHovered(false)}
                aria-label="Forrige slide"
              >
                ‹
              </button>

              <button
                type="button"
                className="heroArrow heroArrowRight"
                onClick={goNext}
                onMouseEnter={() => setIsHeroControlsHovered(true)}
                onMouseLeave={() => setIsHeroControlsHovered(false)}
                aria-label="Næste slide"
              >
                ›
              </button>
            </>
          )}

          <div className="heroOverlay">
            <div
              className={`heroInner ${
                isHeroControlsHovered ? "isHidden" : ""
              }`}
            >
              <div className="heroContent">
                <p className="heroKicker">{slide.kicker}</p>
                <h1 className={titleClass}>{slide.title}</h1>
                <p className="heroText">{slide.text}</p>
              </div>

              <div className="searchBar" aria-label="Søg rejser">
                <label className="searchItem">
                  <span className="searchLabel">Hvor vil du hen?</span>
                  <select
                    className="searchInput"
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                  >
                    <option value="">Alle destinationer</option>
                    {destinationOptions.map((destination) => (
                      <option key={destination} value={destination}>
                        {destination}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="searchItem">
                  <span className="searchLabel">Hvornår?</span>
                  <select
                    className="searchInput"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option value="kommende">Kommende</option>
                    <option value="sommer">Sommer</option>
                    <option value="efteraar">Efterår</option>
                    <option value="vinter">Vinter</option>
                    <option value="">Alle perioder</option>
                  </select>
                </label>

                <label className="searchItem">
                  <span className="searchLabel">Personer</span>
                  <input
                    className="searchInput"
                    type="number"
                    min={1}
                    value={persons}
                    onChange={(e) =>
                      setPersons(Math.max(1, Number(e.target.value)))
                    }
                  />
                </label>

                <Link className="searchCta" to={searchHref}>
                  Find rejser
                </Link>
              </div>

              {heroSlides.length > 1 && (
                <div className="heroDots" aria-label="Hero navigation">
                  {heroSlides.map((hero, index) => (
                    <button
                      key={hero.id}
                      type="button"
                      className={`heroDot ${
                        index === currentHero ? "active" : ""
                      }`}
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

        {hasLoadError && (
          <p className="muted">
            Kunne ikke hente rejser lige nu. Prøv igen om lidt.
          </p>
        )}

        <div className="tripGrid">
          {isLoading ? (
            <p>Henter rejser...</p>
          ) : featuredTrips.length > 0 ? (
            featuredTrips.map((trip) => (
              <article className="tripCard" key={trip.id}>
                <div
                  className="tripImage"
                  style={{ backgroundImage: `url("${trip.image}")` }}
                >
                  <span className="tripBadge">{trip.country}</span>

                  {trip.isSoldOut && (
                    <span
                      className="tripBadge"
                      style={{ right: 12, left: "auto" }}
                    >
                      Udsolgt
                    </span>
                  )}

                  {!trip.isSoldOut && trip.isLowSeats && (
                    <span
                      className="tripBadge"
                      style={{ right: 12, left: "auto" }}
                    >
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
          {isLoading ? (
            <p>Henter afgange...</p>
          ) : upcomingTrips.length > 0 ? (
            upcomingTrips.map((r) => {
              const soldOut = isSoldOut(r);
              const lowSeats = isLowSeats(r);
              const seatsLeft = getSeatsLeft(r);

              return (
                <article className="tripCard" key={r.rejseId}>
                  <div
                    className="tripImage"
                    style={{ backgroundImage: `url("${getImage(r)}")` }}
                  >
                    <span className="tripBadge">{r.destination}</span>

                    {soldOut && (
                      <span
                        className="tripBadge"
                        style={{ right: 12, left: "auto" }}
                      >
                        Udsolgt
                      </span>
                    )}

                    {!soldOut && lowSeats && (
                      <span
                        className="tripBadge"
                        style={{ right: 12, left: "auto" }}
                      >
                        Kun {seatsLeft} tilbage
                      </span>
                    )}
                  </div>

                  <div className="tripBody">
                    <h3>{r.title}</h3>
                    <p>{r.destination}</p>

                    <p className="muted">
                      {new Date(r.startAt).toLocaleDateString("da-DK")}
                    </p>

                    <div className="tripBottom">
                      <strong>{formatPrice(r.price)}</strong>
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