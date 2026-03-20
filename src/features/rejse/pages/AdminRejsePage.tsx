import { Fragment, useEffect, useMemo, useState } from "react";
import { rejseApi } from "../api/rejseApi";
import { busApi } from "../../bus/api/busApi";
import { bookingApi } from "../../booking/api/bookingApi";

import type { Rejse, RejseCreate } from "../model/rejse.types";
import type { Bus } from "../../bus/model/bus.types";
import type { BookingListItem } from "../../booking/model/booking.types";

import CapacityCell from "../components/CapasityCell";
import RejseStatusBadge from "../components/RejseStatusBadge";
import AdminBookingTable from "../../booking/components/AdminBookingTable";

import {
  emptyForm,
  formatDate,
  getFillPercent,
  toInputDateTime,
} from "../utils/rejseHelpers";

export default function AdminRejsePage() {
  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [busser, setBusser] = useState<Bus[]>([]);
  const [form, setForm] = useState<RejseCreate>(emptyForm);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"start" | "price" | "fill">("start");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [expandedRejseId, setExpandedRejseId] = useState<number | null>(null);
  const [bookingsByRejse, setBookingsByRejse] = useState<
    Record<number, BookingListItem[]>
  >({});
  const [busyBookingId, setBusyBookingId] = useState<number | null>(null);
  const [loadingBookingsFor, setLoadingBookingsFor] = useState<number | null>(
    null
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
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
      setError(err instanceof Error ? err.message : "Kunne ikke hente rejser.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const canSave =
    form.title.trim().length > 0 &&
    form.destination.trim().length > 0 &&
    form.startAt.trim().length > 0 &&
    form.endAt.trim().length > 0 &&
    form.price >= 0 &&
    form.maxSeats > 0 &&
    form.busId > 0;

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function getBusLabel(busId?: number | null) {
    if (!busId) return "-";

    const bus = busser.find((b) => b.busId === busId);
    if (!bus) return `#${busId}`;

    return `${bus.registreringnummer} · ${bus.model}`;
  }

  async function createOrUpdateRejse(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: RejseCreate = {
        ...form,
        price: Number(form.price),
        maxSeats: Number(form.maxSeats),
        busId: Number(form.busId),
      };

      if (editingId) {
        await rejseApi.update(editingId, payload);
        setSuccess("Rejse opdateret.");
      } else {
        await rejseApi.create(payload);
        setSuccess("Rejse oprettet.");
      }

      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke gemme rejse.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(rejse: Rejse) {
    setEditingId(rejse.rejseId);
    setSuccess("");
    setError("");

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

  async function handleDelete(rejseId: number) {
    const rejse = rejser.find((r) => r.rejseId === rejseId);
    if (!rejse) return;

    if ((rejse.bookedSeats ?? 0) > 0) {
      setError("Rejsen kan ikke slettes, fordi der er bookinger.");
      return;
    }

    const ok = window.confirm(`Slet rejse #${rejseId}?`);
    if (!ok) return;

    try {
      setDeletingId(rejseId);
      setError("");
      setSuccess("");

      await rejseApi.delete(rejseId);

      if (editingId === rejseId) {
        resetForm();
      }

      if (expandedRejseId === rejseId) {
        setExpandedRejseId(null);
      }

      setSuccess("Rejse slettet.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke slette rejse.");
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleBookings(rejseId: number) {
    if (expandedRejseId === rejseId) {
      setExpandedRejseId(null);
      return;
    }

    setExpandedRejseId(rejseId);

    if (bookingsByRejse[rejseId]) return;

    try {
      setLoadingBookingsFor(rejseId);
      setError("");

      const data = await bookingApi.getByRejseId(rejseId);

      setBookingsByRejse((prev) => ({
        ...prev,
        [rejseId]: data,
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Kunne ikke hente bookinger for rejse."
      );
    } finally {
      setLoadingBookingsFor(null);
    }
  }

  async function refreshBookingsForRejse(rejseId: number) {
    const data = await bookingApi.getByRejseId(rejseId);

    setBookingsByRejse((prev) => ({
      ...prev,
      [rejseId]: data,
    }));
  }

  async function handleCancelBooking(bookingId: number, rejseId: number) {
    const ok = window.confirm(`Annullér booking #${bookingId}?`);
    if (!ok) return;

    try {
      setBusyBookingId(bookingId);
      setError("");
      setSuccess("");

      await bookingApi.cancel(bookingId);
      await Promise.all([refreshBookingsForRejse(rejseId), load()]);

      setSuccess("Booking annulleret.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunne ikke annullere booking."
      );
    } finally {
      setBusyBookingId(null);
    }
  }

  async function handleReactivateBooking(bookingId: number, rejseId: number) {
    const ok = window.confirm(`Genaktiver booking #${bookingId}?`);
    if (!ok) return;

    try {
      setBusyBookingId(bookingId);
      setError("");
      setSuccess("");

      await bookingApi.reactivate(bookingId);
      await Promise.all([refreshBookingsForRejse(rejseId), load()]);

      setSuccess("Booking genaktiveret.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunne ikke genaktivere booking."
      );
    } finally {
      setBusyBookingId(null);
    }
  }

  const filteredRejser = useMemo(() => {
    const q = search.toLowerCase().trim();

    let list = rejser.filter((r) => {
      const haystack = [r.rejseId, r.title, r.destination, getBusLabel(r.busId)]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "fill") return getFillPercent(b) - getFillPercent(a);
      return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
    });

    return list;
  }, [rejser, search, sortBy, busser]);

  return (
    <div className="page">
      <div className="card">
        <div className="section-header">
          <div>
            <h1>Admin rejser</h1>
            <p className="muted">Opret, redigér og administrér rejser.</p>
          </div>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={createOrUpdateRejse} className="adminForm">
          <div className="grid">
            <label>
              Titel
              <input
                className="input"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Fx Berlin Forårstur"
              />
            </label>

            <label>
              Destination
              <input
                className="input"
                value={form.destination}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, destination: e.target.value }))
                }
                placeholder="Fx Berlin"
              />
            </label>

            <label>
              Start
              <input
                className="input"
                type="datetime-local"
                value={form.startAt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startAt: e.target.value }))
                }
              />
            </label>

            <label>
              Slut
              <input
                className="input"
                type="datetime-local"
                value={form.endAt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, endAt: e.target.value }))
                }
              />
            </label>

            <label>
              Pris
              <input
                className="input"
                type="number"
                min={0}
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
              />
            </label>

            <label>
              Max pladser
              <input
                className="input"
                type="number"
                min={1}
                value={form.maxSeats}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    maxSeats: Number(e.target.value),
                  }))
                }
              />
            </label>

            <label>
              Bus
              <select
                className="input"
                value={form.busId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    busId: Number(e.target.value),
                  }))
                }
              >
                <option value={0}>Vælg bus</option>
                {busser.map((bus) => (
                  <option key={bus.busId} value={bus.busId}>
                    {bus.registreringnummer} · {bus.model}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="row">
            <button className="btn" type="submit" disabled={saving || !canSave}>
              {saving
                ? "Gemmer..."
                : editingId
                ? "Gem ændringer"
                : "Opret rejse"}
            </button>

            {editingId && (
              <button
                className="btn ghost"
                type="button"
                onClick={resetForm}
                disabled={saving}
              >
                Annullér redigering
              </button>
            )}

            {!canSave && (
              <span className="muted">
                Titel, destination, datoer, pris, pladser og bus kræves.
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Rejser ({filteredRejser.length})</h2>
            <p className="muted">Søg, sorter og klik for at se bookinger.</p>
          </div>

          <div className="toolbar">
            <input
              className="input"
              type="text"
              placeholder="Søg på titel, destination eller bus..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="input"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "start" | "price" | "fill")
              }
            >
              <option value="start">Startdato</option>
              <option value="price">Pris</option>
              <option value="fill">Mest fyldt</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loader rejser...</p>
        ) : filteredRejser.length === 0 ? (
          <p className="muted">Ingen rejser fundet.</p>
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
                {filteredRejser.map((r) => {
                  const bookings = bookingsByRejse[r.rejseId] ?? [];
                  const isExpanded = expandedRejseId === r.rejseId;
                  const isLoadingBookings = loadingBookingsFor === r.rejseId;

                  return (
                    <Fragment key={r.rejseId}>
                      <tr>
                        <td>#{r.rejseId}</td>
                        <td>{r.title}</td>
                        <td>{r.destination}</td>
                        <td>
                          <RejseStatusBadge rejse={r} />
                        </td>
                        <td>{formatDate(r.startAt)}</td>
                        <td>{formatDate(r.endAt)}</td>
                        <td>{r.price.toLocaleString("da-DK")} kr.</td>
                        <td>
                          <CapacityCell rejse={r} />
                        </td>
                        <td>{getBusLabel(r.busId)}</td>
                        <td>
                          <div className="actionCell">
                            <button
                              className="btn ghost"
                              type="button"
                              onClick={() => toggleBookings(r.rejseId)}
                            >
                              {isExpanded ? "Skjul bookinger" : "Vis bookinger"}
                            </button>

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
                              disabled={
                                deletingId === r.rejseId || (r.bookedSeats ?? 0) > 0
                              }
                              onClick={() => handleDelete(r.rejseId)}
                              title={
                                (r.bookedSeats ?? 0) > 0
                                  ? "Rejsen kan ikke slettes, fordi der er bookinger."
                                  : ""
                              }
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

                      {isExpanded && (
                        <tr className="bookingExpandRow">
                          <td colSpan={10}>
                            <div className="bookingExpandBox">
                              <h4>
                                Bookinger for rejse #{r.rejseId} · Total:{" "}
                                {bookings.length}
                              </h4>

                              <p className="muted">
                                Aktive: {bookings.filter((b) => !b.isCancelled).length}
                                {" · "}
                                Annullerede:{" "}
                                {bookings.filter((b) => b.isCancelled).length}
                              </p>

                              <AdminBookingTable
                                bookings={bookings}
                                loading={isLoadingBookings}
                                emptyMessage="Ingen bookinger endnu."
                                actionLoadingId={busyBookingId}
                                onCancel={(bookingId) =>
                                  handleCancelBooking(bookingId, r.rejseId)
                                }
                                onReactivate={(bookingId) =>
                                  handleReactivateBooking(bookingId, r.rejseId)
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}