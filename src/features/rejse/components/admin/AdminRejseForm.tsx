import GeoAutocompleteInput from "../../../geo/components/GeoAutocompleteInput";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { ProgressionTerritoryAdminItem } from "../../../progression-admin/model/progressionTerritoryAdmin.types";

import type { RejseCreate } from "../../model/rejse.types";
import type { Bus } from "../../../bus/model/bus.types";

type Props = {
  form: RejseCreate;
  setForm: Dispatch<SetStateAction<RejseCreate>>;
  busser: Bus[];
  territories: ProgressionTerritoryAdminItem[];
  editingId: number | null;
  saving: boolean;
  canSave: boolean;
  error?: string;
  success?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function AdminRejseForm({
  form,
  setForm,
  busser,
  territories,
  editingId,
  saving,
  canSave,
  error,
  success,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <>
      <div className="section-header">
        <div>
          <h1>{editingId ? `Rediger rejse #${editingId}` : "Admin rejser"}</h1>
          <p className="muted">
            {editingId
              ? "Opdatér rejseoplysninger og gem ændringer."
              : "Opret, redigér og administrér rejser."}
          </p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={onSubmit} className="adminForm">
        <div className="card" style={{ marginBottom: 16 }}>
          <h3>Grundinfo</h3>

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
              <GeoAutocompleteInput
                value={form.destination}
                placeholder="Fx Berlin, København eller Prague"
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    destination: value,
                  }))
                }
                onSelect={(place) =>
                  setForm((prev) => ({
                    ...prev,
                    destination: place.name,
                    city: place.name,
                    country: place.countryCode,
                    region: place.admin1Code ?? "",
                    municipality: null,
                    latitude: place.latitude ?? null,
                    longitude: place.longitude ?? null,
                  }))
                }
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
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h3>Kapacitet og pris</h3>

          <div className="grid">
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
                placeholder="Fx 799"
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
                placeholder="Fx 50"
              />
            </label>

            <label>
              Bus
              <select
                className="input"
                value={form.busId ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    busId: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              >
                <option value="">Ingen</option>
                {busser.map((bus) => (
                  <option key={bus.busId} value={bus.busId}>
                    {bus.registreringnummer} · {bus.model}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Progression område
              <select
                className="input"
                value={form.progressionTerritoryId ?? ""}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    progressionTerritoryId: e.target.value
                      ? Number(e.target.value)
                      : null,
                  }))
                }
              >
                <option value="">Auto / ingen valgt</option>

                {territories.map((territory) => (
                  <option
                    key={territory.progressionTerritoryId}
                    value={territory.progressionTerritoryId}
                  >
                    {territory.name} ({territory.key})
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h3>Indhold</h3>

          <label>
            Kort beskrivelse
            <input
              className="input"
              value={form.shortDescription ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  shortDescription: e.target.value,
                }))
              }
              placeholder="Kort tekst til kort og lister"
            />
          </label>

          <label style={{ marginTop: 12, display: "block" }}>
            Beskrivelse
            <textarea
              className="input"
              value={form.description ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Beskriv rejsen lidt mere detaljeret"
              rows={5}
            />
          </label>

          <label style={{ marginTop: 12, display: "block" }}>
            Billede URL
            <input
              className="input"
              value={form.imageUrl ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
              placeholder="https://..."
            />
          </label>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h3>Status</h3>

          <div className="row" style={{ gap: 24, flexWrap: "wrap" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={!!form.isFeatured}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isFeatured: e.target.checked,
                  }))
                }
              />
              Featured
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={!!form.isPublished}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isPublished: e.target.checked,
                  }))
                }
              />
              Publiceret
            </label>
          </div>
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
              onClick={onCancel}
              disabled={saving}
            >
              Annullér redigering
            </button>
          )}

          {!canSave && (
            <span className="muted">
              Titel, destination, datoer, pris og pladser kræves.
            </span>
          )}
        </div>
      </form>
    </>
  );
}