import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

type HeroSlide = {
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
};

const heroSlides: HeroSlide[] = [
  {
    kicker: "",
    title: "Billige ture, dyre minder.",
    text: "Find din næste busrejse hurtigt og enkelt. Oplev Europa med gode priser, stærke ruter og minder der holder længere end turen.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=80",
  },
  {
    kicker: "",
    title: "Rejs længere. Brug mindre.",
    text: "Kom afsted på ture med karakter, komfort og oplevelser der føles større end prisen. Perfekt til både weekendture og længere rejser.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=80",
  },
  {
    kicker: "",
    title: "Europa venter.",
    text: "Fra storbyer til kyst og natur. Find næste afgang og gør turen enkel fra start til slut med BusPlanen.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80",
  },
];

const featuredTrips: FeaturedTrip[] = [
  {
    id: 1,
    country: "Italien",
    title: "Livsnydelse ved Cilientokysten",
    text: "Oplev smukke kyststrækninger, afslappet stemning og klassiske italienske oplevelser på en tur fyldt med udsigt og charme.",
    price: "8 dage fra 10.999,-",
    image:
      "https://images.unsplash.com/photo-1502780402662-acc01917f4a1?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 2,
    country: "Portugal",
    title: "Farverige Madeira",
    text: "Grønne bjergsider, hyggelige byer og storslåede udsigter gør Madeira til en af de rejser man husker længe.",
    price: "8 dage fra 9.399,-",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 3,
    country: "Holland",
    title: "Holland i blomst",
    text: "En rolig og smuk rejse med blomster, kanaler og klassiske oplevelser for både familier og voksne rejsende.",
    price: "5 dage fra 5.299,-",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function Home() {
  const [currentHero, setCurrentHero] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isArrowHovered, setIsArrowHovered] = useState(false);

  const slide = heroSlides[currentHero];

  useEffect(() => {
    if (isPaused) return;

    const intervalId = window.setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  const titleClass = useMemo(() => {
    return slide.title.length > 22 ? "heroTitle heroTitleLong" : "heroTitle";
  }, [slide.title]);

  function goPrev() {
    setCurrentHero((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  }

  function goNext() {
    setCurrentHero((prev) => (prev + 1) % heroSlides.length);
  }

  function goTo(index: number) {
    setCurrentHero(index);
  }

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
                  <span className="searchValue">Vælg rejsetype</span>
                </div>

                <div className="searchItem">
                  <span className="searchLabel">Destination</span>
                  <span className="searchValue">Vælg rejsemål</span>
                </div>

                <div className="searchItem">
                  <span className="searchLabel">Tidspunkt</span>
                  <span className="searchValue">Vælg periode</span>
                </div>

                <Link className="searchCta" to="/rejser">
                  Vis rejser
                </Link>
              </div>

              <div className="heroDots" aria-label="Hero navigation">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`heroDot ${index === currentHero ? "active" : ""}`}
                    onClick={() => goTo(index)}
                    aria-label={`Gå til slide ${index + 1}`}
                  />
                ))}
              </div>
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
          {featuredTrips.map((trip) => (
            <article className="tripCard" key={trip.id}>
              <div
                className="tripImage"
                style={{ backgroundImage: `url("${trip.image}")` }}
              >
                <span className="tripBadge">{trip.country}</span>
              </div>

              <div className="tripBody">
                <h3>{trip.title}</h3>
                <p>{trip.text}</p>

                <div className="tripBottom">
                  <strong>{trip.price}</strong>
                  <Link to="/rejser" className="tripArrow" aria-label={`Se mere om ${trip.title}`}>
                    →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}