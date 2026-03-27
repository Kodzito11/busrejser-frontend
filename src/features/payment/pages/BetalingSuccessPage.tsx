import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { stripeApi, type CheckoutStatusResponse } from "../api/stripeApi";

export default function BetalingSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [data, setData] = useState<CheckoutStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
  if (!sessionId) {
    setError("Stripe session mangler.");
    setLoading(false);
    return;
  }

  const validSessionId = sessionId;

  let cancelled = false;
  let timeoutId: number | undefined;
  let attempts = 0;

  async function poll() {
    try {
      const result = await stripeApi.getCheckoutStatus(validSessionId);

      if (cancelled) return;

      setData(result);

      if (result.status === "processing" && attempts < 8) {
        attempts += 1;
        timeoutId = window.setTimeout(poll, 2000);
        return;
      }

      setLoading(false);
    } catch (e: any) {
      if (cancelled) return;
      setError(e?.message ?? "Kunne ikke hente betalingsstatus.");
      setLoading(false);
    }
  }

  poll();

  return () => {
    cancelled = true;
    if (timeoutId) window.clearTimeout(timeoutId);
  };
}, [sessionId]);

  return (
    <div className="wrap">
      <section className="card">
        <h1>Betaling gennemført</h1>

        {loading && (
          <>
            <p>Vi tjekker din betaling og opretter din booking...</p>
            <p className="muted">Det kan tage et par sekunder.</p>
          </>
        )}

        {!loading && error && <div className="error">{error}</div>}

        {!loading && !error && data?.status === "booking_created" && (
          <>
            <div className="success">Din booking er oprettet.</div>

            {data.bookingReference && (
              <div className="card" style={{ marginTop: 16 }}>
                <strong>Booking reference</strong>
                <div className="muted">{data.bookingReference}</div>
              </div>
            )}
          </>
        )}

        {!loading && !error && data?.status === "processing" && (
          <div className="card" style={{ marginTop: 16 }}>
            <strong>Betaling modtaget</strong>
            <div className="muted">
              Betalingen er registreret, men bookingen er stadig under behandling.
              Opdater siden om et øjeblik.
            </div>
          </div>
        )}

        {!loading && !error && data?.status === "unpaid" && (
          <div className="error">
            Betalingen er ikke markeret som gennemført.
          </div>
        )}

        {sessionId && (
          <div className="card" style={{ marginTop: 16 }}>
            <strong>Stripe session</strong>
            <div className="muted">{sessionId}</div>
          </div>
        )}

        <div className="row" style={{ marginTop: 16 }}>
          <Link to="/rejser">
            <button>Tilbage til rejser</button>
          </Link>

          <Link to="/mine-bookinger">
            <button className="ghost">Mine bookinger</button>
          </Link>
        </div>
      </section>
    </div>
  );
}