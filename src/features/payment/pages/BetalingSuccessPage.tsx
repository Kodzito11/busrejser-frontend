import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { stripeApi } from "../api/stripeApi";
import { getErrorMessage } from "../../../shared/utils/error";

export default function BetalingSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<
    "processing" | "booking_created" | "unpaid"
  >("processing");

  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      setError("Session id mangler");
      return;
    }

    const timers = {
      interval: 0,
      timeout: 0,
    };

    async function poll() {
      try {
        const res = await stripeApi.getCheckoutStatus(sessionId!);

        setStatus(res.status);

        if (res.status === "booking_created") {
          setBookingRef(res.bookingReference ?? null);

          clearInterval(timers.interval);
          clearTimeout(timers.timeout);
        }

        if (res.status === "unpaid") {
          setError("Betaling ikke gennemført");
          clearInterval(timers.interval);
          clearTimeout(timers.timeout);
        }
      } catch (error: unknown) {
        setError(getErrorMessage(error, "Noget gik galt"));
        clearInterval(timers.interval);
        clearTimeout(timers.timeout);
      }
    }

    poll();

    timers.interval = window.setInterval(() => {
      setSeconds((s) => s + 2);
      poll();
    }, 2000);

    timers.timeout = window.setTimeout(() => {
      clearInterval(timers.interval);
      setError("Tog for lang tid... prøv igen eller tjek dine bookinger");
    }, 30000);

    return () => {
      clearInterval(timers.interval);
      clearTimeout(timers.timeout);
    };
  }, [sessionId, navigate]);

  return (
    <div className="wrap">
      <section className="card">
        <h1>Betaling gennemført</h1>

        {/* 🔄 PROCESSING */}
        {!error && status === "processing" && (
          <>
            <p>⏳ Din booking bliver oprettet...</p>
            <p className="muted">Vent venligst ({seconds}s)</p>
          </>
        )}

        {/* ✅ SUCCESS */}
        {!error && status === "booking_created" && (
          <>
            <p> Din booking er oprettet!</p>

            {bookingRef && (
              <div className="card" style={{ marginTop: 16 }}>
                <strong>Booking reference</strong>
                <div>{bookingRef}</div>
              </div>
            )}

            <p className="muted">
              Din booking er klar. Du kan nu se den under dine bookinger eller gå videre til din progression.
            </p>
          </>
        )}

        {/* ❌ ERROR */}
        {error && (
          <div className="error" style={{ marginTop: 16 }}>
            {error}
          </div>
        )}

        {/* 🔘 BUTTONS */}
        <div className="row" style={{ marginTop: 16 }}>
          <Link to="/rejser">
            <button>Tilbage til rejser</button>
          </Link>

          <Link to="/mine-bookinger">
            <button className="ghost">Mine bookinger</button>
          </Link>
        </div>
      </section>
      <div className="card" style={{ marginTop: 16 }}>
        <h2>Din rejse tæller med i din progression</h2>
        <p className="muted">
          Når rejsen er gennemført, bliver den en del af dit rejsekort og kan låse badges op.
        </p>

        <div className="row" style={{ marginTop: 12 }}>
          <button onClick={() => navigate("/progression")}>
            Se min progression
          </button>
        </div>
      </div>

    </div>
  );
}
