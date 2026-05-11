import { useEffect, useMemo, useState } from "react";
import { progressionTerritoryAdminApi } from "../api/progressionTerritoryAdminApi";
import ProgressionTerritoryAliasEditor from "../components/ProgressionTerritoryAliasEditor";
import ProgressionTerritoryForm from "../components/ProgressionTerritoryForm";
import ProgressionTerritoryTable from "../components/ProgressionTerritoryTable";
import type {
  CreateProgressionTerritoryRequest,
  ProgressionTerritoryAdminItem,
  UpdateProgressionTerritoryRequest,
} from "../model/progressionTerritoryAdmin.types";

export default function AdminProgressionTerritoriesPage() {
  const [items, setItems] = useState<ProgressionTerritoryAdminItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [message, setMessage] = useState("");

  const selected = useMemo(() => {
    if (selectedId == null) return null;

    return items.find((x) => x.progressionTerritoryId === selectedId) ?? null;
  }, [items, selectedId]);

  async function load() {
    try {
      setErr("");
      setLoading(true);

      const result = await progressionTerritoryAdminApi.getAll();
      setItems(result);
    } catch (e: any) {
      setErr(e?.message ?? "Kunne ikke hente progression territories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload: CreateProgressionTerritoryRequest) {
    try {
      setErr("");
      setMessage("");
      setSaving(true);

      await progressionTerritoryAdminApi.create(payload);
      setMessage("Territory oprettet.");

      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Kunne ikke oprette territory.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(
    id: number,
    payload: UpdateProgressionTerritoryRequest
  ) {
    try {
      setErr("");
      setMessage("");
      setSaving(true);

      await progressionTerritoryAdminApi.update(id, payload);
      setMessage("Territory opdateret.");

      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Kunne ikke opdatere territory.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddAlias(territoryId: number, value: string) {
    try {
      setErr("");
      setMessage("");
      setSaving(true);

      await progressionTerritoryAdminApi.addAlias(territoryId, { value });
      setMessage("Alias tilføjet.");

      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Kunne ikke tilføje alias.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveAlias(aliasId: number) {
    try {
      setErr("");
      setMessage("");
      setSaving(true);

      await progressionTerritoryAdminApi.removeAlias(aliasId);
      setMessage("Alias fjernet.");

      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Kunne ikke fjerne alias.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="card">Loader progression territories...</div>;
  }

  return (
    <div className="progression-admin-page">
      <header className="progression-admin-header">
        <div>
          <h1>Progression territories</h1>
          <p className="muted">
            Styr hvilke lande og områder der er aktive i progression-systemet.
          </p>
        </div>

        <button
          type="button"
          className="btn secondary"
          onClick={() => {
            setSelectedId(null);
            setMessage("");
            setErr("");
          }}
        >
          Opret ny
        </button>
      </header>

      {err && <div className="error">{err}</div>}

      {message && <div className="success">{message}</div>}

      <div className="progression-admin-layout">
        <div className="progression-admin-main">
          <ProgressionTerritoryTable
            items={items}
            selectedId={selectedId}
            onEdit={(item) => setSelectedId(item.progressionTerritoryId)}
          />
        </div>

        <div className="progression-admin-side">
          <ProgressionTerritoryForm
            selected={selected}
            saving={saving}
            onCancelEdit={() => setSelectedId(null)}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
          />

          <ProgressionTerritoryAliasEditor
            selected={selected}
            saving={saving}
            onAddAlias={handleAddAlias}
            onRemoveAlias={handleRemoveAlias}
          />
        </div>
      </div>
    </div>
  );
}