import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../shared/api/api";
import type { Rejse } from "../model/rejse.types";

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

      const r = await api.rejser.get(Number(id));
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

  const seats = rejse ? Math.max(0, rejse.maxSeats - (rejse.bookedSeats ?? 0)) : 0;

  function handleStartBooking() {
    if (!id) return;

    navigate(`/book/${id}?antal=${antal}`);
  }

  if (loading) return <p>Loader...</p>;
  if (err) return <p>{err}</p>;
  if (!rejse) return <p>Rejse ikke fundet.</p>;

  return (
    <div className="wrap">
      <div className="card">
        <h1>{rejse.title}</h1>
        <p className="muted">{rejse.destination}</p>

        <div className="rejse-info">
          <div>
            <strong>Afgang</strong>
            <div>{new Date(rejse.startAt).toLocaleString()}</div>
          </div>

          <div>
            <strong>Hjemkomst</strong>
            <div>{new Date(rejse.endAt).toLocaleString()}</div>
          </div>

          <div>
            <strong>Pris</strong>
            <div>{rejse.price} kr</div>
          </div>

          <div>
            <strong>Pladser tilbage</strong>
            <div>{seats}</div>
          </div>
        </div>

        <div className="booking-box">
          <p className="muted">
            Din booking oprettes først, når betalingen er gennemført.
          </p>

          <label>Antal pladser</label>
          <input
            type="number"
            value={antal}
            min={1}
            max={seats || 1}
            onChange={(e) => setAntal(Number(e.target.value))}
          />

          <button
            onClick={handleStartBooking}
            disabled={seats === 0 || antal < 1 || antal > seats}
          >
            Start booking
          </button>
        </div>
      </div>
    </div>
  );
}