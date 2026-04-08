import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { rejseApi } from "../api/rejseApi";
import { busApi } from "../../bus/api/busApi";
import { bookingApi } from "../../booking/api/bookingApi";

import type { Rejse, RejseCreate } from "../model/rejse.types";
import type { Bus } from "../../bus/model/bus.types";
import type { BookingListItem } from "../../booking/model/booking.types";

import {
  emptyForm,
  getFillPercent,
  toInputDateTime,
} from "../utils/rejseHelpers";

import AdminRejseStats from "../../rejse/components/admin/AdminRejseStats";
import AdminRejseForm from "../../rejse/components/admin/AdminRejseForm";
import AdminRejseTable from "../../rejse/components/admin/AdminRejseTable";

import type { RejseSortBy } from "../model/adminRejse.types";

export default function AdminRejsePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const highlightRejseId = location.state?.highlightRejseId as
    | number
    | undefined;

  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [busser, setBusser] = useState<Bus[]>([]);
  const [form, setForm] = useState<RejseCreate>(emptyForm);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<RejseSortBy>("start");

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

  useEffect(() => {
    if (!highlightRejseId || rejser.length === 0) return;

    const selected = rejser.find((r) => r.rejseId === highlightRejseId);
    if (!selected) return;

    setSearch(String(highlightRejseId));
    setExpandedRejseId(highlightRejseId);

    if (!bookingsByRejse[highlightRejseId]) {
      void toggleBookings(highlightRejseId, true);
    }

    requestAnimationFrame(() => {
      const el = document.getElementById(`rejse-row-${highlightRejseId}`);
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "center" });

      setTimeout(() => {
        el.classList.add("fadeOut");
      }, 1400);

      setTimeout(() => {
        navigate(location.pathname, {
          replace: true,
          state: {},
        });
      }, 2000);
    });
  }, [highlightRejseId, rejser]);

  const canSave =
    form.title.trim().length > 0 &&
    form.destination.trim().length > 0 &&
    form.startAt.trim().length > 0 &&
    form.endAt.trim().length > 0 &&
    form.price >= 0 &&
    form.maxSeats > 0;

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

  async function createOrUpdateRejse(e: React.FormEvent<HTMLFormElement>) {
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
        busId: form.busId ?? null,
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
      busId: rejse.busId ?? null,
      shortDescription: rejse.shortDescription ?? "",
      description: rejse.description ?? "",
      imageUrl: rejse.imageUrl ?? "",
      isFeatured: rejse.isFeatured,
      isPublished: rejse.isPublished,
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

  async function toggleBookings(rejseId: number, forceOpen = false) {
    if (!forceOpen && expandedRejseId === rejseId) {
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
      <AdminRejseStats rejser={rejser} />

      <div className="card">
        <AdminRejseForm
          form={form}
          setForm={setForm}
          busser={busser}
          editingId={editingId}
          saving={saving}
          canSave={canSave}
          error={error}
          success={success}
          onSubmit={createOrUpdateRejse}
          onCancel={resetForm}
        />
      </div>

      <div className="card">
        <AdminRejseTable
          rejser={filteredRejser}
          search={search}
          sortBy={sortBy}
          loading={loading}
          deletingId={deletingId}
          expandedRejseId={expandedRejseId}
          bookingsByRejse={bookingsByRejse}
          busyBookingId={busyBookingId}
          loadingBookingsFor={loadingBookingsFor}
          highlightRejseId={highlightRejseId}
          getBusLabel={getBusLabel}
          onSearchChange={setSearch}
          onSortChange={setSortBy}
          onEdit={startEdit}
          onDelete={handleDelete}
          onToggleBookings={toggleBookings}
          onCancelBooking={handleCancelBooking}
          onReactivateBooking={handleReactivateBooking}
        />
      </div>
    </div>
  );
}