import { useEffect, useState } from "react";
import { rejseApi } from "../api/rejseApi";
import { busApi } from "../../bus/api/busApi";
import type { Rejse, RejseCreate } from "../model/rejse.types";
import type { Bus } from "../../bus/model/bus.types";

const emptyForm: RejseCreate = {
  title: "",
  destination: "",
  startAt: "",
  endAt: "",
  price: 0,
  maxSeats: 0,
  busId: 0,
};

function getFillPercent(r: Rejse) {
  const booked = r.bookedSeats ?? 0;
  if (!r.maxSeats) return 0;

  return Math.min(100, Math.round((booked / r.maxSeats) * 100));
}

function toInputDateTime(value: string) {
  if (!value) return "";

  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("da-DK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatus(rejse: Rejse) {
  const now = new Date();
  const start = new Date(rejse.startAt);
  const end = new Date(rejse.endAt);

  if (end < now) return "Afsluttet";
  if (start <= now && end >= now) return "I gang";
  return "Kommende";
}

function getStatusClassName(rejse: Rejse) {
  const status = getStatus(rejse);
  if (status === "Kommende") return "kommende";
  if (status === "I gang") return "igang";
  return "afsluttet";
}

export default function AdminRejsePage() {
  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [busser, setBusser] = useState<Bus[]>([]);
  const [form, setForm] = useState<RejseCreate>(emptyForm);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [rejseData, busData] = await Promise.all([
        rejseApi.list(),
        busApi.list(),
      ]);

      setRejser(rejseData);
      setBusser(busData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke hente data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateField<K extends keyof RejseCreate>(key: K, value: RejseCreate[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
  setForm(emptyForm);
  setEditingId(null);
  setError("");
}

  function startEdit(rejse: Rejse) {
    setEditingId(rejse.rejseId);
    setError("");
    setSuccess("");

    setForm({
      title: rejse.title,
      destination: rejse.destination,
      startAt: toInputDateTime(rejse.startAt),
      endAt: toInputDateTime(rejse.endAt),
      price: rejse.price,
      maxSeats: rejse.maxSeats,
      busId: rejse.busId ?? 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateForm() {
    if (!form.title.trim()) return "Titel mangler.";
    if (!form.destination.trim()) return "Destination mangler.";
    if (!form.startAt) return "Starttid mangler.";
    if (!form.endAt) return "Sluttid mangler.";
    if (new Date(form.endAt) <= new Date(form.startAt)) {
      return "Sluttid skal være efter starttid.";
    }
    if (form.price < 0) return "Pris kan ikke være negativ.";
    if (form.maxSeats <= 0) return "Max pladser skal være over 0.";
    if (!form.busId || form.busId <= 0) return "Du skal vælge en bus.";

    return "";
  }

  function getBusLabel(busId: number | null | undefined) {
    if (!busId) return "-";
    const bus = busser.find((b) => b.busId === busId);
    if (!bus) return `#${busId}`;
    return `#${bus.busId} · ${bus.registreringnummer}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId !== null) {
        await rejseApi.update(editingId, form);
        setSuccess("Rejse opdateret.");
      } else {
        await rejseApi.create(form);
        setSuccess("Rejse oprettet.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : editingId !== null
          ? "Kunne ikke opdatere rejse."
          : "Kunne ikke oprette rejse."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const ok = confirm(`Slet rejse #${id}?`);
    if (!ok) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await rejseApi.delete(id);

      if (editingId === id) {
        resetForm();
      }

      setRejser((prev) => prev.filter((r) => r.rejseId !== id));
      setSuccess("Rejse slettet.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke slette rejse.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>{editingId !== null ? `Redigér rejse #${editingId}` : "Rejser"}</h1>
        <p className="muted">
          {editingId !== null ? "Opdatér rejseoplysninger." : "Opret og administrér rejser."}
        </p>

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
            min={0}
            placeholder="Pris"
            value={form.price}
            onChange={(e) => updateField("price", Number(e.target.value))}
            required
          />

          <input
            className="input"
            type="number"
            min={1}
            placeholder="Max pladser"
            value={form.maxSeats}
            onChange={(e) => updateField("maxSeats", Number(e.target.value))}
            required
          />

          <select
            className="input"
            value={form.busId ?? 0}
            onChange={(e) => updateField("busId", Number(e.target.value))}
            required
          >
            <option value={0}>Vælg bus</option>
            {busser.map((bus) => (
              <option key={bus.busId} value={bus.busId}>
                #{bus.busId} · {bus.registreringnummer} · {bus.model}
              </option>
            ))}
          </select>

          <div className="row">
            <button className="btn" type="submit" disabled={saving}>
              {saving
                ? editingId !== null
                  ? "Gemmer..."
                  : "Opretter..."
                : editingId !== null
                ? "Gem ændringer"
                : "Opret rejse"}
            </button>

            {editingId !== null && (
              <button className="btn ghost" type="button" onClick={resetForm}>
                Annullér
              </button>
            )}
          </div>
        </form>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

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
                  <th>Status</th>
                  <th>Start</th>
                  <th>Slut</th>
                  <th>Pris</th>
                  <th>Belægning</th>
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
                    <td>
                      <span className={`statusBadge ${getStatusClassName(r)}`}>
                        {getStatus(r)}
                      </span>
                    </td>
                    <td>{formatDate(r.startAt)}</td>
                    <td>{formatDate(r.endAt)}</td>
                    <td>{r.price.toLocaleString("da-DK")} kr.</td>
                    <td>
                      <div className="capacity">
                        <div className="capacity-bar">
                          <div
                            className="capacity-fill"
                            style={{
                              width: `${getFillPercent(r)}%`,
                              background:
                                getFillPercent(r) > 90
                                  ? "#ef4444"
                                  : getFillPercent(r) > 60
                                    ? "#f59e0b"
                                    : "#3b82f6",
                            }}
                          />
                        </div>
                        <span className="capacity-text">
                          {r.bookedSeats ?? 0} / {r.maxSeats}
                        </span>
                      </div>
                    </td>
                    <td>{getBusLabel(r.busId)}</td>
                    <td>
                      <div className="actionCell">
                        <button
                          className="btn"
                          type="button"
                          onClick={() => startEdit(r)}
                        >
                          Redigér
                        </button>

                        <button
                          className="btn danger"
                          type="button"
                          disabled={deletingId === r.rejseId || (r.bookedSeats ?? 0) > 0}
                          onClick={() => handleDelete(r.rejseId)}
                          title={(r.bookedSeats ?? 0) > 0 ? "Rejsen kan ikke slettes, fordi der er bookinger." : ""}
                        >
                          {(r.bookedSeats ?? 0) > 0
                            ? "Har bookinger"
                            : deletingId === r.rejseId
                              ? "Sletter..."
                              : "Slet"}
                        </button>
                      </div>
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