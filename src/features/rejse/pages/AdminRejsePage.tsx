import { useEffect, useState } from "react";
import { rejseApi } from "../api/rejseApi";
import type { Rejse, RejseCreate } from "../model/rejse.types";

const emptyForm: RejseCreate = {
  title: "",
  destination: "",
  startAt: "",
  endAt: "",
  price: 0,
  maxSeats: 0,
  busId: 0,
};

export default function AdminRejsePage() {
  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [form, setForm] = useState<RejseCreate>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadRejser() {
    try {
      setLoading(true);
      setError("");
      const data = await rejseApi.list();
      setRejser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke hente rejser.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRejser();
  }, []);

  function updateField<K extends keyof RejseCreate>(key: K, value: RejseCreate[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      await rejseApi.create(form);
      setForm(emptyForm);
      await loadRejser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke oprette rejse.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const ok = confirm(`Slet rejse #${id}?`);
    if (!ok) return;

    try {
      await rejseApi.delete(id);
      setRejser((prev) => prev.filter((r) => r.rejseId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Kunne ikke slette rejse.");
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Rejser</h1>
        <p className="muted">Opret og administrér rejser.</p>

        <form className="adminForm" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Titel"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
          />

          <input
            className="input"
            placeholder="Destination"
            value={form.destination}
            onChange={(e) => updateField("destination", e.target.value)}
            required
          />

          <input
            className="input"
            type="datetime-local"
            value={form.startAt}
            onChange={(e) => updateField("startAt", e.target.value)}
            required
          />

          <input
            className="input"
            type="datetime-local"
            value={form.endAt}
            onChange={(e) => updateField("endAt", e.target.value)}
            required
          />

          <input
            className="input"
            type="number"
            placeholder="Pris"
            value={form.price}
            onChange={(e) => updateField("price", Number(e.target.value))}
            required
          />

          <input
            className="input"
            type="number"
            placeholder="Max pladser"
            value={form.maxSeats}
            onChange={(e) => updateField("maxSeats", Number(e.target.value))}
            required
          />

          <input
            className="input"
            type="number"
            placeholder="Bus ID"
            value={form.busId}
            onChange={(e) => updateField("busId", Number(e.target.value))}
            required
          />

          <button className="btn" type="submit" disabled={saving}>
            {saving ? "Gemmer..." : "Opret rejse"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p className="muted">Loader rejser...</p>
        ) : rejser.length === 0 ? (
          <p className="muted">Ingen rejser endnu.</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titel</th>
                  <th>Destination</th>
                  <th>Start</th>
                  <th>Slut</th>
                  <th>Pris</th>
                  <th>Pladser</th>
                  <th>Bus</th>
                  <th>Handling</th>
                </tr>
              </thead>
              <tbody>
                {rejser.map((r) => (
                  <tr key={r.rejseId}>
                    <td>#{r.rejseId}</td>
                    <td>{r.title}</td>
                    <td>{r.destination}</td>
                    <td>{new Date(r.startAt).toLocaleString()}</td>
                    <td>{new Date(r.endAt).toLocaleString()}</td>
                    <td>{r.price} kr.</td>
                    <td>{r.maxSeats}</td>
                    <td>#{r.busId}</td>
                    <td>
                      <button
                        className="btn danger"
                        type="button"
                        onClick={() => handleDelete(r.rejseId)}
                      >
                        Slet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}