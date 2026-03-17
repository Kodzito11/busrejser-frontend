import { useEffect, useMemo, useState } from "react";
import { api } from "../../../shared/api/api";
import { API_BASE } from "../../../shared/api/http";
import type { Bus } from "../model/bus.types";
import { hasRole, isAdmin } from "../../../auth/auth";

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
  const [openImage, setOpenImage] = useState<string | null>(null);

  const [form, setForm] = useState<BusForm>({
    registreringnummer: "",
    model: "",
    busselskab: "",
    status: 0,
    type: 0,
    kapasitet: 1,
  });

  const canCreate = useMemo(() => {
    return (
      form.registreringnummer.trim().length > 0 &&
      form.model.trim().length > 0 &&
      form.kapasitet > 0
    );
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
      const newBusId = await api.buses.create(form);

      if (selectedImage) {
        await api.buses.uploadImage(newBusId, selectedImage);
      }

      setForm({
        registreringnummer: "",
        model: "",
        busselskab: "",
        status: 0,
        type: 0,
        kapasitet: 1,
      });

      setSelectedImage(null);

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

  const busCount = buses?.length ?? 0;
  const canCreateBus = hasRole("Admin", "Medarbejder");
  const canDeleteBus = isAdmin();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  return (
    <div className="wrap">
      <header className="header">
        <div>
          <h1>Busser</h1>
          <p className="muted">Her kan du se vores tilgængelige busser</p>
        </div>
        <button onClick={refresh} disabled={loading}>
          Refresh
        </button>
      </header>

      {err && <div className="error">{err}</div>}

      {canCreateBus && (
        <section className="card">
          <h2>Opret bus</h2>

          <div className="grid">
            <label>
              Registreringnummer
              <input
                value={form.registreringnummer}
                onChange={(e) =>
                  setForm({ ...form, registreringnummer: e.target.value })
                }
              />
            </label>

            <label>
              Model
              <input
                value={form.model}
                onChange={(e) =>
                  setForm({ ...form, model: e.target.value })
                }
              />
            </label>

            <label>
              Busselskab
              <input
                value={form.busselskab}
                onChange={(e) =>
                  setForm({ ...form, busselskab: e.target.value })
                }
              />
            </label>

            <label>
              Kapasitet
              <input
                type="number"
                value={form.kapasitet}
                onChange={(e) =>
                  setForm({ ...form, kapasitet: Number(e.target.value) })
                }
              />
            </label>

            <label>
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: Number(e.target.value) })
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
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: Number(e.target.value) })
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
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setSelectedImage(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <div className="row">
            <button onClick={createBus} disabled={loading || !canCreate}>
              Opret
            </button>
          </div>
        </section>
      )}

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
              <div>Billede</div>
              <div>Reg</div>
              <div>Model</div>
              <div>Selskab</div>
              <div>Status</div>
              <div>Type</div>
              <div>Kap</div>
              {canDeleteBus && <div></div>}
            </div>

            {buses.map((b) => (
              <div className="tr busser" key={b.busId}>
                <div>{b.busId}</div>

                <div>
                  {b.imageUrl ? (
                    <img
                      src={`${API_BASE}${b.imageUrl}`}
                      alt={b.model}
                      className="busThumb"
                      onClick={() => setOpenImage(`${API_BASE}${b.imageUrl}`)}
                    />
                  ) : (
                    <span className="muted">Ingen</span>
                  )}
                </div>

                <div>{b.registreringnummer}</div>
                <div>{b.model}</div>
                <div>{b.busselskab}</div>
                <div>{statusLabel(b.status)}</div>
                <div>{typeLabel(b.type)}</div>
                <div>{b.kapasitet}</div>

                {canDeleteBus && (
                  <div className="actions">
                    <button
                      className="danger"
                      onClick={() => deleteBus(b.busId)}
                      disabled={loading}
                    >
                      Slet
                    </button>
                  </div>
                )}
              </div>
            ))}
            {openImage && (
              <div className="imageModal" onClick={() => setOpenImage(null)}>
                <img
                  src={openImage}
                  alt="Bus billede"
                  className="imageModalContent"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>

        )}
      </section>
    </div>
  );
}