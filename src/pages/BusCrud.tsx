import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import type { Bus } from "../api";

const statusLabel = (s: number) => ["Aktiv", "Inaktiv", "Vedligeholdelse"][s] ?? `(${s})`;
const typeLabel = (t: number) => ["StorTurBus", "MiniBus", "VIPBus", "Shuttle", "Andet"][t] ?? `(${t})`;

type BusForm = {
  registreringnummer: string;
  model: string;
  busselskab: string;
  status: number;
  type: number;
  kapasitet: number;
};

export default function BusCrud() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  const [form, setForm] = useState<BusForm>({
    registreringnummer: "",
    model: "",
    busselskab: "",
    status: 0,
    type: 0,
    kapasitet: 1,
  });

  const canCreate = useMemo(() => {
    return form.registreringnummer.trim().length > 0 && form.model.trim().length > 0 && form.kapasitet > 0;
  }, [form]);

  async function refresh() {
    setErr("");
    setLoading(true);
    try {
      const list = await api.buses.list();
      setBuses(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
      setBuses([]);
    } finally {
      setLoading(false);
    }
  }

  async function createBus() {
    if (!canCreate) return;
    setErr("");
    setLoading(true);
    try {
      await api.buses.create(form);
      setForm((p) => ({ ...p, registreringnummer: "", model: "", kapasitet: 1 }));
      await refresh();
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function deleteBus(id: number) {
    setErr("");
    setLoading(true);
    try {
      await api.buses.delete(id);
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

  const busCount = buses?.length ?? 0;

  return (
    <div className="wrap">
      <header className="header">
        <div>
          <h1>Busser</h1>
          <p className="muted">CRUD mod din backend</p>
        </div>
        <button onClick={refresh} disabled={loading}>
          Refresh
        </button>
      </header>

      {err && <div className="error">{err}</div>}

      <section className="card">
        <h2>Opret bus</h2>
        <div className="grid">
          <label>
            Registreringnummer
            <input value={form.registreringnummer} onChange={(e) => setForm({ ...form, registreringnummer: e.target.value })} />
          </label>

          <label>
            Model
            <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          </label>

          <label>
            Busselskab
            <input value={form.busselskab} onChange={(e) => setForm({ ...form, busselskab: e.target.value })} />
          </label>

          <label>
            Kapasitet
            <input type="number" value={form.kapasitet} onChange={(e) => setForm({ ...form, kapasitet: Number(e.target.value) })} />
          </label>

          <label>
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}>
              <option value={0}>Aktiv</option>
              <option value={1}>Inaktiv</option>
              <option value={2}>Vedligeholdelse</option>
            </select>
          </label>

          <label>
            Type
            <select value={form.type} onChange={(e) => setForm({ ...form, type: Number(e.target.value) })}>
              <option value={0}>StorTurBus</option>
              <option value={1}>MiniBus</option>
              <option value={2}>VIPBus</option>
              <option value={3}>Shuttle</option>
              <option value={4}>Andet</option>
            </select>
          </label>
        </div>

        <div className="row">
          <button onClick={createBus} disabled={loading || !canCreate}>
            Opret
          </button>
          {!canCreate && <span className="muted">Registreringnummer + Model + Kapasitet kræves</span>}
        </div>
      </section>

      <section className="card">
        <h2>Liste ({busCount})</h2>

        {loading && busCount === 0 ? (
          <p className="muted">Loader…</p>
        ) : busCount === 0 ? (
          <p className="muted">Ingen busser endnu.</p>
        ) : (
          <div className="table">
            <div className="tr head busser">
              <div>ID</div>
              <div>Reg</div>
              <div>Model</div>
              <div>Selskab</div>
              <div>Status</div>
              <div>Type</div>
              <div>Kap</div>
              <div></div>
            </div>

            {buses.map((b) => (
              <div className="tr busser" key={b.busId}>
                <div>{b.busId}</div>
                <div>{b.registreringnummer}</div>
                <div>{b.model}</div>
                <div>{b.busselskab}</div>
                <div>{statusLabel(b.status)}</div>
                <div>{typeLabel(b.type)}</div>
                <div>{b.kapasitet}</div>
                <div className="actions">
                  <button className="danger" onClick={() => deleteBus(b.busId)} disabled={loading}>
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