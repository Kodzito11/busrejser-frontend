import { Link } from "react-router-dom";

export default function BetalingCancelPage() {
  return (
    <div className="wrap">
      <section className="card">
        <h1>Betaling blev annulleret</h1>

        <p>
          Din betaling blev ikke gennemført, og der er ikke oprettet nogen booking.
        </p>

        <div className="row" style={{ marginTop: 16 }}>
          <Link to="/rejser">
            <button>Tilbage til rejser</button>
          </Link>

          <Link to="/">
            <button className="ghost">Forside</button>
          </Link>
        </div>
      </section>
    </div>
  );
}