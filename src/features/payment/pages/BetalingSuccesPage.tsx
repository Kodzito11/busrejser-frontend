import { Link, useSearchParams } from "react-router-dom";

export default function BetalingSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="wrap">
      <section className="card">
        <h1>Betaling gennemført</h1>

        <p>
          Tak for din betaling. Din booking bliver nu behandlet.
        </p>

        <p className="muted">
          Du modtager din booking, når Stripe webhooken er behandlet.
        </p>

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