import { useState } from "react";
import type { ProgressionTerritoryAdminItem } from "../model/progressionTerritoryAdmin.types";

type Props = {
  selected: ProgressionTerritoryAdminItem | null;
  saving: boolean;
  onAddAlias: (territoryId: number, value: string) => Promise<void>;
  onRemoveAlias: (aliasId: number) => Promise<void>;
};

export default function ProgressionTerritoryAliasEditor({
  selected,
  saving,
  onAddAlias,
  onRemoveAlias,
}: Props) {
  const [value, setValue] = useState("");

  if (!selected) {
    return (
      <div className="card">
        <h2>Aliases</h2>
        <p className="muted">Vælg et territory for at redigere aliases.</p>
      </div>
    );
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    if (!selected || !value.trim()) return;

    await onAddAlias(selected.progressionTerritoryId, value);
    setValue("");
  }

  return (
    <div className="card">
      <h2>Aliases for {selected.name}</h2>
      <p className="muted">
        Aliases bruges til at matche rejser/visited locations mod dette
        territory.
      </p>

      <br />

      <form className="progression-admin-actions" onSubmit={handleAdd}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="fx deutschland"
        />

        <button type="submit" className="btn" disabled={saving}>
          Tilføj alias
        </button>
      </form>

      <br />

      {selected.aliases.length === 0 ? (
        <div className="progression-admin-muted-box">
          Ingen aliases endnu.
        </div>
      ) : (
        <div className="progression-admin-alias-grid">
          {selected.aliases.map((alias) => (
            <div
              key={alias.progressionTerritoryAliasId}
              className="progression-admin-alias-item"
            >
              <strong>{alias.value}</strong>

              <button
                type="button"
                className="btn secondary"
                disabled={saving}
                onClick={() =>
                  onRemoveAlias(alias.progressionTerritoryAliasId)
                }
              >
                Fjern
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}