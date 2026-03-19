import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../shared/api/api";
import type { Rejse } from "../model/rejse.types";

export default function RejseDetalje() {
  const { id } = useParams();
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

  async function handleBook() {
    try {
      await api.bookings.create({
        rejseId: Number(id),
        kundeNavn: "",
        kundeEmail: "",
        antalPladser: antal,
      });

      alert("Booking gennemført!");
      load();
    } catch (e: any) {
      alert(e?.message ?? "Booking fejlede");
    }
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
          <label>Antal pladser</label>
          <input
            type="number"
            value={antal}
            min={1}
            max={seats || 1}
            onChange={(e) => setAntal(Number(e.target.value))}
          />

          <button onClick={handleBook} disabled={seats === 0 || antal < 1 || antal > seats}>
            Book nu
          </button>
        </div>
      </div>
    </div>
  );
}