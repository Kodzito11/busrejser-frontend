import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../shared/api/api";
import type { Rejse } from "../model/rejse.types";
import "../../../styles/features/public/rejser-status.css";

export default function RejseDetalje() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rejse, setRejse] = useState<Rejse | null>(null);
  const [antal, setAntal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setLoading(true);
      setErr("");

      const rejseId = Number(id);
      if (!rejseId || Number.isNaN(rejseId)) {
        throw new Error("Ugyldigt rejse-id.");
      }

      const r = await api.rejser.get(rejseId);
      setRejse(r);
    } catch (e: any) {
      setErr(e?.message ?? "Kunne ikke hente rejse.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  const seats = useMemo(() => {
    if (!rejse) return 0;
    return Math.max(0, rejse.maxSeats - (rejse.bookedSeats ?? 0));
  }, [rejse]);

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
    if (!id || !rejse || seats === 0 || antal < 1 || antal > seats) return;
    navigate(`/book/${id}?antal=${antal}`);
  }

  function formatDateTime(value: string) {
    return new Date(value).toLocaleString("da-DK", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat("da-DK").format(value);
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

  const canBook = seats > 0 && antal >= 1 && antal <= seats;

  return (
    <div className="wrap">
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {rejse.imageUrl ? (
          <div
            style={{
              height: "320px",
              backgroundImage: `url(${rejse.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <div
            style={{
              height: "220px",
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <span className="muted">Ingen billede tilgængeligt</span>
          </div>
        )}

        <div style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              alignItems: "start",
              gridTemplateColumns: "minmax(0, 2fr) minmax(320px, 1fr)",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginBottom: "0.75rem",
                }}
              >
                <span className={seatsStatus.className}>{seatsStatus.text}</span>
                <span className="muted">{durationText}</span>
              </div>

              <h1 style={{ marginBottom: "0.5rem" }}>{rejse.title}</h1>
              <p className="muted" style={{ fontSize: "1rem", marginBottom: "1rem" }}>
                {rejse.destination}
              </p>

              {rejse.shortDescription && (
                <p style={{ marginBottom: "1.5rem", lineHeight: 1.7 }}>
                  {rejse.shortDescription}
                </p>
              )}

              <div
                className="rejse-info"
                style={{
                  display: "grid",
                  gap: "1rem",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  marginBottom: "1.5rem",
                }}
              >
                <div className="card">
                  <strong>Afgang</strong>
                  <div style={{ marginTop: 8 }}>{formatDateTime(rejse.startAt)}</div>
                </div>

                <div className="card">
                  <strong>Hjemkomst</strong>
                  <div style={{ marginTop: 8 }}>{formatDateTime(rejse.endAt)}</div>
                </div>

                <div className="card">
                  <strong>Pris pr. person</strong>
                  <div style={{ marginTop: 8 }}>{formatPrice(rejse.price)} kr</div>
                </div>

                <div className="card">
                  <strong>Ledige pladser</strong>
                  <div style={{ marginTop: 8 }}>{seats}</div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: "1rem" }}>
                <h3 style={{ marginBottom: "0.75rem" }}>Om rejsen</h3>
                <p style={{ margin: 0, lineHeight: 1.7 }}>
                  {rejse.description ||
                    "Tag med på en behagelig og enkel busrejse med fokus på pris, komfort og en god oplevelse fra start til slut."}
                </p>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: "0.75rem" }}>Godt at vide</h3>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.8 }}>
                  <li>Din booking oprettes først, når betalingen er gennemført.</li>
                  <li>Betaling sker sikkert via Stripe.</li>
                  <li>Du modtager din bookingreference efter gennemført betaling.</li>
                </ul>
              </div>
            </div>

            <aside>
              <div
                className="card booking-box"
                style={{
                  position: "sticky",
                  top: "1rem",
                }}
              >
                <h2 style={{ marginBottom: "0.5rem" }}>Book rejsen</h2>
                <p className="muted" style={{ marginBottom: "1rem" }}>
                  Vælg antal pladser og gå videre til betaling.
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <strong>Pris pr. person</strong>
                    <div style={{ marginTop: 6 }}>{formatPrice(rejse.price)} kr</div>
                  </div>

                  <div>
                    <strong>Ledige pladser</strong>
                    <div style={{ marginTop: 6 }}>{seats}</div>
                  </div>
                </div>

                <label htmlFor="antalPladser" style={{ display: "block", marginBottom: 8 }}>
                  Antal pladser
                </label>
                <input
                  id="antalPladser"
                  type="number"
                  value={antal}
                  min={1}
                  max={seats || 1}
                  onChange={(e) => handleAntalChange(e.target.value)}
                />

                <div
                  style={{
                    marginTop: "1rem",
                    marginBottom: "1rem",
                    padding: "0.9rem 1rem",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <strong>Total</strong>
                  <div style={{ marginTop: 6, fontSize: "1.1rem" }}>
                    {formatPrice(totalPrice)} kr
                  </div>
                </div>

                <button onClick={handleStartBooking} disabled={!canBook} style={{ width: "100%" }}>
                  {seats === 0 ? "Udsolgt" : "Start booking"}
                </button>

                <button
                  className="ghost"
                  onClick={() => navigate("/rejser")}
                  style={{ width: "100%", marginTop: "0.75rem" }}
                >
                  Tilbage til rejser
                </button>

                {!canBook && seats > 0 && (
                  <div className="error" style={{ marginTop: 12 }}>
                    Vælg et gyldigt antal pladser.
                  </div>
                )}

                {seats === 0 && (
                  <div className="error" style={{ marginTop: 12 }}>
                    Denne rejse er udsolgt.
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}