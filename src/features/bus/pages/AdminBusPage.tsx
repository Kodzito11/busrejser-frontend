import { useEffect, useMemo, useState } from "react";
import { api } from "../../../shared/api/api";
import { hasRole, isAdmin } from "../../../auth/auth";

import type { Bus } from "../model/bus.types";
import type { BusForm } from "../model/bus.types";

import AdminBusTable from "../components/AdminBusTable";
import BusImageModal from "../components/BusImageModal";

import { emptyBusForm } from "../utils/busHelpers";

export default function AdminBusPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<BusForm>(emptyBusForm);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [openImage, setOpenImage] = useState<string | null>(null);

  const canCreateBus = hasRole("Admin", "Medarbejder");
  const canDeleteBus = isAdmin();

  const canCreate = useMemo(() => {
    return (
      form.registreringnummer.trim().length > 0 &&
      form.model.trim().length > 0 &&
      form.kapasitet > 0
    );
  }, [form]);

  async function refresh() {
    try {
      setError("");
      setLoading(true);

      const list = await api.buses.list();
      setBuses(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke hente busser.");
      setBuses([]);
    } finally {
      setLoading(false);
    }
  }

  async function createBus() {
    if (!canCreate) return;

    try {
      setError("");
      setLoading(true);

      const newBusId = await api.buses.create(form);

      if (selectedImage) {
        await api.buses.uploadImage(newBusId, selectedImage);
      }

      setForm(emptyBusForm);
      setSelectedImage(null);

      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke oprette bus.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteBus(id: number) {
    try {
      setError("");
      setLoading(true);

      await api.buses.delete(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke slette bus.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenImage(null);
      }
    }

    if (openImage) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openImage]);

  return (
    <div className="page">
      <div className="card">
        <div className="section-header">
          <div>
            <h1>Admin busser</h1>
            <p className="muted">Opret og administrér busser.</p>
          </div>

          <button className="btn" onClick={refresh} disabled={loading}>
            {loading ? "Loader..." : "Refresh"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {canCreateBus && (
          <div className="adminForm">
            <div className="grid">
              <label>
                Registreringnummer
                <input
                  className="input"
                  value={form.registreringnummer}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      registreringnummer: e.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Model
                <input
                  className="input"
                  value={form.model}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      model: e.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Busselskab
                <input
                  className="input"
                  value={form.busselskab}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      busselskab: e.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Kapasitet
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={form.kapasitet}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      kapasitet: Number(e.target.value),
                    }))
                  }
                />
              </label>

              <label>
                Status
                <select
                  className="input"
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: Number(e.target.value),
                    }))
                  }
                >
                  <option value={0}>Aktiv</option>
                  <option value={1}>Inaktiv</option>
                  <option value={2}>Vedligeholdelse</option>
                </select>
              </label>

              <label>
                Type
                <select
                  className="input"
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: Number(e.target.value),
                    }))
                  }
                >
                  <option value={0}>StorTurBus</option>
                  <option value={1}>MiniBus</option>
                  <option value={2}>VIPBus</option>
                  <option value={3}>Shuttle</option>
                  <option value={4}>Andet</option>
                </select>
              </label>

              <label>
                Busbillede
                <input
                  className="input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <div className="row">
              <button
                className="btn"
                type="button"
                onClick={createBus}
                disabled={loading || !canCreate}
              >
                Opret bus
              </button>

              {!canCreate && (
                <span className="muted">
                  Registreringnummer, model og kapacitet kræves.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Busser ({buses.length})</h2>
            <p className="muted">Se alle busser i systemet.</p>
          </div>
        </div>

        <AdminBusTable
          buses={buses}
          loading={loading}
          canDelete={canDeleteBus}
          onDelete={deleteBus}
          onOpenImage={setOpenImage}
        />
      </div>

      <BusImageModal imageUrl={openImage} onClose={() => setOpenImage(null)} />
    </div>
  );
}