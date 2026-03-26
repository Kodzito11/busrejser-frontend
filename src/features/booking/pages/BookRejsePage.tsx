import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { api } from "../../../shared/api/api";
import { getCurrentUser } from "../../../auth/auth";
import type { Rejse } from "../../rejse/model/rejse.types";

export default function BookRejse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const isLoggedIn = !!currentUser;

  const rejseId = Number(id);

  const [rejse, setRejse] = useState<Rejse | null>(null);
  const [availableSeats, setAvailableSeats] = useState<number>(0);

  const [kundeNavn, setKundeNavn] = useState("");
  const [kundeEmail, setKundeEmail] = useState("");
  const [antalPladser, setAntalPladser] = useState(1);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"" | "success" | "error">("");

  async function load() {
    setMsg("");
    setMsgType("");
    setPageLoading(true);

    try {
      const [r, seats] = await Promise.all([
        api.rejser.get(rejseId),
        api.bookings.getAvailableSeats(rejseId),
      ]);

      setRejse(r);
      setAvailableSeats(seats);

      if (isLoggedIn && currentUser) {
        setKundeNavn(currentUser.username ?? "");
        setKundeEmail(currentUser.email ?? "");
      }
    } catch (e: any) {
      setMsgType("error");
      setMsg(e?.message ?? "Kunne ikke hente rejse.");
    } finally {
      setPageLoading(false);
    }
  }

  async function goToPayment() {
    setMsg("");
    setMsgType("");
    setLoading(true);

    try {
      const payload = {
        rejseId,
        kundeNavn: isLoggedIn ? currentUser?.username ?? "" : kundeNavn.trim(),
        kundeEmail: isLoggedIn ? currentUser?.email ?? "" : kundeEmail.trim(),
        antalPladser: Number(antalPladser),
      };

      const res = await api.stripe.createCheckoutSession(payload);

      if (!res?.url) {
        throw new Error("Stripe checkout URL mangler.");
      }

      window.location.href = res.url;
    } catch (e: any) {
      setMsgType("error");
      setMsg(e?.message ?? "Kunne ikke starte betaling.");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!rejseId || Number.isNaN(rejseId)) {
      setPageLoading(false);
      setMsgType("error");
      setMsg("Ugyldigt rejse-id.");
      return;
    }

    load();
  }, [rejseId]);

  if (pageLoading) {
    return (
      <div className="wrap">
        <p>Loader rejse...</p>
      </div>
    );
  }

  if (!rejse) {
    return (
      <div className="wrap">
        <section className="card">
          <h1>Rejse ikke fundet</h1>
          {msg && <div className="error">{msg}</div>}

          <div className="row" style={{ marginTop: 12 }}>
            <button className="ghost" onClick={() => navigate("/rejser")}>
              Tilbage til rejser
            </button>
          </div>
        </section>
      </div>
    );
  }

  const canSubmit =
    !loading &&
    availableSeats > 0 &&
    antalPladser > 0 &&
    antalPladser <= availableSeats &&
    (isLoggedIn || (kundeNavn.trim().length > 0 && kundeEmail.trim().length > 0));

  return (
    <div className="wrap">
      <section className="card">
        <h1>{rejse.title}</h1>
        <p className="muted">{rejse.destination}</p>

        <div className="grid">
          <div>
            <strong>Start</strong>
            <div>{new Date(rejse.startAt).toLocaleString()}</div>
          </div>

          <div>
            <strong>Slut</strong>
            <div>{new Date(rejse.endAt).toLocaleString()}</div>
          </div>

          <div>
            <strong>Pris</strong>
            <div>{rejse.price} kr</div>
          </div>

          <div>
            <strong>Ledige pladser</strong>
            <div>{availableSeats}</div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Book rejse</h2>

        {availableSeats <= 0 && (
          <div className="error">Rejsen er udsolgt.</div>
        )}

        {isLoggedIn ? (
          <div className="card" style={{ marginBottom: 16 }}>
            <strong>Du booker som:</strong>
            <div>{currentUser?.username}</div>
            <div className="muted">{currentUser?.email}</div>
          </div>
        ) : (
          <div className="grid">
            <label>
              Navn
              <input
                value={kundeNavn}
                onChange={(e) => setKundeNavn(e.target.value)}
                placeholder="Dit navn"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={kundeEmail}
                onChange={(e) => setKundeEmail(e.target.value)}
                placeholder="din@email.dk"
              />
            </label>
          </div>
        )}

        <div className="grid">
          <label>
            Antal pladser
            <input
              type="number"
              min={1}
              max={availableSeats}
              value={antalPladser}
              onChange={(e) => setAntalPladser(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="row">
          <button onClick={goToPayment} disabled={!canSubmit}>
            {loading ? "Sender til betaling..." : "Gå til betaling"}
          </button>

          <button className="ghost" onClick={() => navigate("/rejser")}>
            Tilbage
          </button>
        </div>

        {antalPladser > availableSeats && availableSeats > 0 && (
          <div className="error" style={{ marginTop: 12 }}>
            Du kan ikke booke flere pladser end der er ledigt.
          </div>
        )}

        {msg && (
          <div
            style={{ marginTop: 12 }}
            className={msgType === "error" ? "error" : "success"}
          >
            {msg}
          </div>
        )}
      </section>
    </div>
  );
}