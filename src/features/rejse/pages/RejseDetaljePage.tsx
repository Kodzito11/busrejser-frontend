import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../../../shared/api/api";
import { getCurrentUser } from "../../auth/utils/auth.storage";
import type { Rejse } from "../model/rejse.types";
import "../../../styles/features/public/rejser-status.css";
import { getErrorMessage } from "../../../shared/utils/error";

export default function RejseDetalje() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [rejse, setRejse] = useState<Rejse | null>(null);
  const [antal, setAntal] = useState(1);
  const [availableSeats, setAvailableSeats] = useState<number | null>(null);
  const [kundeNavn, setKundeNavn] = useState("");
  const [kundeEmail, setKundeEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [err, setErr] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const currentUser = getCurrentUser();
  const isLoggedIn = !!currentUser;
  const currentUserName = currentUser
    ? `${currentUser.firstName ?? ""} ${currentUser.lastName ?? ""}`.trim()
    : "";
  const antalFromQuery = Number(searchParams.get("antal"));

  async function load() {
    try {
      setLoading(true);
      setErr("");

      const rejseId = Number(id);
      if (!rejseId || Number.isNaN(rejseId)) {
        throw new Error("Ugyldigt rejse-id.");
      }

      const [r, seats] = await Promise.all([
        api.rejser.get(rejseId),
        api.bookings.getAvailableSeats(rejseId),
      ]);

      setRejse(r);
      setAvailableSeats(seats);

      if (!Number.isNaN(antalFromQuery) && antalFromQuery > 0 && seats > 0) {
        setAntal(Math.min(antalFromQuery, seats));
      }
    } catch (error: unknown) {
      setErr(getErrorMessage(error, "Kunne ikke hente rejse."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id, antalFromQuery]);

  const seats = useMemo(() => {
    if (!rejse) return 0;
    return availableSeats ?? Math.max(0, rejse.maxSeats - (rejse.bookedSeats ?? 0));
  }, [availableSeats, rejse]);

  const totalPrice = useMemo(() => {
    if (!rejse) return 0;
    return rejse.price * antal;
  }, [rejse, antal]);

  const durationText = useMemo(() => {
    if (!rejse) return "-";

    const start = new Date(rejse.startAt).getTime();
    const end = new Date(rejse.endAt).getTime();

    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
      return "-";
    }

    const diffMs = end - start;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    if (days > 0 && hours > 0) return `${days} dage og ${hours} timer`;
    if (days > 0) return `${days} dage`;
    return `${hours} timer`;
  }, [rejse]);

  const seatsStatus = useMemo(() => {
    if (seats <= 0) {
      return {
        text: "Udsolgt",
        className: "status soldout",
      };
    }

    if (seats <= 5) {
      return {
        text: `Få pladser tilbage (${seats})`,
        className: "status low",
      };
    }

    return {
      text: `${seats} pladser tilbage`,
      className: "status available",
    };
  }, [seats]);

  function handleAntalChange(value: string) {
    const next = Number(value);

    if (Number.isNaN(next)) {
      setAntal(1);
      return;
    }

    if (next < 1) {
      setAntal(1);
      return;
    }

    if (seats > 0 && next > seats) {
      setAntal(seats);
      return;
    }

    setAntal(next);
  }

  function handleStartBooking() {
    void goToPayment();
  }

  async function goToPayment() {
    if (!id || !rejse || !canBook) return;

    setPaymentError("");
    setPaymentLoading(true);

    try {
      const payload = {
        rejseId: Number(id),
        kundeNavn: isLoggedIn
          ? currentUserName || (currentUser?.email ?? "")
          : kundeNavn.trim(),
        kundeEmail: isLoggedIn ? currentUser?.email ?? "" : kundeEmail.trim(),
        antalPladser: Number(antal),
      };

      const res = await api.stripe.createCheckoutSession(payload);

      if (!res?.url) {
        throw new Error("Stripe checkout URL mangler.");
      }

      window.location.href = res.url;
    } catch (error: unknown) {
      setPaymentError(getErrorMessage(error, "Kunne ikke starte betaling."));
      setPaymentLoading(false);
    }
  }

  function formatCompactDate(value: string) {
    return new Date(value).toLocaleDateString("da-DK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat("da-DK").format(value);
  }

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  if (loading) {
    return (
      <div className="wrap">
        <section className="card">
          <p className="muted">Loader rejse...</p>
        </section>
      </div>
    );
  }

  if (err) {
    return (
      <div className="wrap">
        <section className="card">
          <h1>Kunne ikke hente rejse</h1>
          <div className="error" style={{ marginTop: 12 }}>
            {err}
          </div>

          <div className="row" style={{ marginTop: 16 }}>
            <button className="ghost" onClick={() => navigate("/rejser")}>
              Tilbage til rejser
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (!rejse) {
    return (
      <div className="wrap">
        <section className="card">
          <h1>Rejse ikke fundet</h1>
          <p className="muted">Denne rejse findes ikke eller er blevet fjernet.</p>

          <div className="row" style={{ marginTop: 16 }}>
            <button className="ghost" onClick={() => navigate("/rejser")}>
              Tilbage til rejser
            </button>
          </div>
        </section>
      </div>
    );
  }

  const guestInfoIsValid =
    kundeNavn.trim().length > 0 && isValidEmail(kundeEmail);
  const accountInfoIsValid =
    isLoggedIn && !!(currentUser?.email ?? "").trim();
  const seatsInputIsValid = seats > 0 && antal >= 1 && antal <= seats;
  const canBook =
    !paymentLoading &&
    seatsInputIsValid &&
    (accountInfoIsValid || guestInfoIsValid);

  return (
    <div className="tripDetailPage">
      <section className="tripDetailHero">
        {rejse.imageUrl ? (
          <div
            className="tripDetailHero__image"
            style={{ backgroundImage: `url(${rejse.imageUrl})` }}
          />
        ) : (
          <div className="tripDetailHero__image tripDetailHero__image--empty">
            <span className="muted">Ingen billede tilgængeligt</span>
          </div>
        )}

        <div className="tripDetailHero__body">
          <div className="tripDetailHero__meta">
            <span className={seatsStatus.className}>{seatsStatus.text}</span>
            <span>{durationText}</span>
          </div>

          <h1>{rejse.title}</h1>
          <p>{rejse.destination}</p>
        </div>
      </section>

      <div className="tripCheckoutLayout">
        <main className="tripCheckoutMain">
          <section className="tripStepCard">
            <div className="tripStepHeader">
              <span className="tripStepNumber">1</span>
              <div>
                <p>Vælg antal pladser</p>
                <h2>Hvor mange skal med?</h2>
              </div>
            </div>

            <div className="seatPicker">
              <label htmlFor="antalPladser">
                Antal pladser
                <span>{seats} ledige</span>
              </label>
              <input
                id="antalPladser"
                type="number"
                value={antal}
                min={1}
                max={seats || 1}
                onChange={(e) => handleAntalChange(e.target.value)}
              />
            </div>

            {!seatsInputIsValid && seats > 0 && (
              <div className="error tripInlineMessage">
                Vælg et gyldigt antal pladser.
              </div>
            )}

            {seats === 0 && (
              <div className="error tripInlineMessage">Denne rejse er udsolgt.</div>
            )}
          </section>

          <section className="tripStepCard">
            <div className="tripStepHeader">
              <span className="tripStepNumber">2</span>
              <div>
                <p>Dine oplysninger</p>
                <h2>{isLoggedIn ? "Bookes på din profil" : "Hvem skal bookingen stå på?"}</h2>
              </div>
            </div>

            {isLoggedIn ? (
              <div className="tripAccountSummary">
                <strong>Bookes som</strong>
                <span>{currentUserName || currentUser?.email}</span>
                <p>{currentUser?.email}</p>
              </div>
            ) : (
              <div className="guestCheckoutFields">
                <label htmlFor="kundeNavn">
                  Navn
                  <input
                    id="kundeNavn"
                    value={kundeNavn}
                    onChange={(e) => setKundeNavn(e.target.value)}
                    placeholder="Dit navn"
                    required
                  />
                </label>

                <label htmlFor="kundeEmail">
                  Email
                  <input
                    id="kundeEmail"
                    type="email"
                    value={kundeEmail}
                    onChange={(e) => setKundeEmail(e.target.value)}
                    placeholder="din@email.dk"
                    required
                  />
                </label>
              </div>
            )}
          </section>

          <section className="tripStepCard">
            <div className="tripStepHeader">
              <span className="tripStepNumber">3</span>
              <div>
                <p>Tryg betaling</p>
                <h2>Sikkert videre til Stripe</h2>
              </div>
            </div>

            <ul className="tripTrustList">
              <li>Sikker betaling via Stripe</li>
              <li>Booking oprettes først efter betaling</li>
              <li>Du modtager bookingreference efter betaling</li>
            </ul>
          </section>
        </main>

        <aside className="tripBookingColumn">
          <div className="tripBookingSummary">
            <p className="tripSummaryEyebrow">Din booking</p>
            <h2>{rejse.title}</h2>
            <p className="tripSummaryDestination">{rejse.destination}</p>

            {(rejse.shortDescription || rejse.description) && (
              <p className="tripSummaryDescription">
                {rejse.shortDescription || rejse.description}
              </p>
            )}

            <div className="tripSummaryRoute">
              <div>
                <span>Afgang</span>
                <strong>{formatCompactDate(rejse.startAt)}</strong>
              </div>
              <div>
                <span>Hjemkomst</span>
                <strong>{formatCompactDate(rejse.endAt)}</strong>
              </div>
            </div>

            <div className="tripSummaryDetails">
              <div>
                <span>Varighed</span>
                <strong>{durationText}</strong>
              </div>
              <div>
                <span>Ledige pladser</span>
                <strong>{seats}</strong>
              </div>
            </div>

            <div className="tripSummaryRows">
              <div>
                <span>Antal pladser</span>
                <strong>{antal}</strong>
              </div>
              <div>
                <span>Pris pr. person</span>
                <strong>{formatPrice(rejse.price)} kr</strong>
              </div>
            </div>

            <div className="tripSummaryTotal">
              <span>Totalpris</span>
              <strong>{formatPrice(totalPrice)} kr</strong>
            </div>

            <button
              className="tripPrimaryCta"
              onClick={handleStartBooking}
              disabled={!canBook}
            >
              {paymentLoading
                ? "Sender til betaling..."
                : seats === 0
                  ? "Udsolgt"
                  : "Fortsæt til sikker betaling"}
            </button>
            <p className="tripPaymentHint">Sikker betaling via Stripe</p>

            {!canBook && seats > 0 && !isLoggedIn && !guestInfoIsValid && (
              <div className="error tripSummaryError">
                Udfyld navn og en gyldig email før betaling.
              </div>
            )}

            {paymentError && (
              <div className="error tripSummaryError">{paymentError}</div>
            )}

            <button className="tripSecondaryCta" onClick={() => navigate("/rejser")}>
              Tilbage til rejser
            </button>

          </div>
        </aside>
      </div>
    </div>
  );
}
