import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import type { Rejse, Bus } from "../api";
import TripCalendar from "./TripCalendar";

type Form = {
  title: string;
  destination: string;
  startAt: string; // datetime-local value
  endAt: string;
  price: number;
  maxSeats: number;
  busId: string; // select value
};

function toIso(dtLocal: string) {
  // "2026-02-28T12:30" -> ISO
  return dtLocal ? new Date(dtLocal).toISOString() : "";
}

export default function Rejser() {
  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const monthLabel = new Intl.DateTimeFormat("da-DK", { month: "long", year: "numeric" }).format(currentMonth);

  function prevMonth() {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  const [form, setForm] = useState<Form>({
    title: "",
    destination: "",
    startAt: "",
    endAt: "",
    price: 0,
    maxSeats: 0,
    busId: "",
  });

  const canCreate = useMemo(() => {
    return (
      form.title.trim().length > 0 &&
      form.destination.trim().length > 0 &&
      form.startAt.length > 0 &&
      form.endAt.length > 0
    );
  }, [form]);

  async function refresh() {
    setErr("");
    setLoading(true);
    try {
      const [list, busList] = await Promise.all([api.rejser.list(), api.buses.list()]);
      setRejser(Array.isArray(list) ? list : []);
      setBuses(Array.isArray(busList) ? busList : []);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function createRejse() {
    if (!canCreate) return;
    setErr("");
    setLoading(true);
    try {
      await api.rejser.create({
        title: form.title,
        destination: form.destination,
        startAt: toIso(form.startAt),
        endAt: toIso(form.endAt),
        price: Number(form.price) || 0,
        maxSeats: Number(form.maxSeats) || 0,
        busId: form.busId ? Number(form.busId) : null,
      });
      setForm((p) => ({ ...p, title: "", destination: "" }));
      await refresh();
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function deleteRejse(id: number) {
    setErr("");
    setLoading(true);
    try {
      await api.rejser.delete(id);
      await refresh();
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="wrap">
      <header className="header">
        <div>
          <h1>Rejser</h1>
          <p className="muted">Opret og se kommende rejser</p>
        </div>
        <button onClick={refresh} disabled={loading}>Refresh</button>
      </header>

      {err && <div className="error">{err}</div>}

      <section className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={prevMonth}>←</button>
        <div style={{ fontWeight: 800, textTransform: "capitalize" }}>{monthLabel}</div>
        <button onClick={nextMonth}>→</button>
      </section>

      <TripCalendar trips={rejser} currentMonth={currentMonth} />

      <section className="card">
        <h2>Opret rejse</h2>

        <div className="grid">
          <label>
            Titel
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>

          <label>
            Destination
            <input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
          </label>

          <label>
            Start
            <input type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
          </label>

          <label>
            Slut
            <input type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
          </label>

          <label>
            Pris
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </label>

          <label>
            Max pladser
            <input type="number" value={form.maxSeats} onChange={(e) => setForm({ ...form, maxSeats: Number(e.target.value) })} />
          </label>

          <label>
            Bus (valgfri)
            <select value={form.busId} onChange={(e) => setForm({ ...form, busId: e.target.value })}>
              <option value="">Ingen</option>
              {buses.map((b) => (
                <option key={b.busId} value={b.busId}>
                  {b.registreringnummer} — {b.model}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="row">
          <button onClick={createRejse} disabled={loading || !canCreate}>Opret</button>
          {!canCreate && <span className="muted">Titel + destination + start/slut kræves</span>}
        </div>
      </section>

      <section className="card">
        <h2>Kommende rejser ({rejser.length})</h2>

        {loading && rejser.length === 0 ? (
          <p className="muted">Loader…</p>
        ) : rejser.length === 0 ? (
          <p className="muted">Ingen rejser endnu.</p>
        ) : (
          <div className="table">
            <div className="tr head rejser">
              <div>ID</div>
              <div>Titel</div>
              <div>Destination</div>
              <div>Start</div>
              <div>Slut</div>
              <div>Pris</div>
              <div>Pladser</div>
              <div>Bus</div>
              <div></div>
            </div>

            {rejser.map((r) => (
              <div className="tr rejser" key={r.rejseId}>
                <div>{r.rejseId}</div>
                <div>{r.title}</div>
                <div>{r.destination}</div>
                <div>{new Date(r.startAt).toLocaleString()}</div>
                <div>{new Date(r.endAt).toLocaleString()}</div>
                <div>{r.price}</div>
                <div>{r.maxSeats}</div>
                <div>{r.busId ?? "-"}</div>
                <div className="actions">
                  <button className="danger" onClick={() => deleteRejse(r.rejseId)} disabled={loading}>
                    Slet
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}