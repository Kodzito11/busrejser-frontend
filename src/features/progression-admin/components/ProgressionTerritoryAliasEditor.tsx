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

      <form className="row-actions" onSubmit={handleAdd}>
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
        <p className="muted">Ingen aliases endnu.</p>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          {selected.aliases.map((alias) => (
            <div key={alias.progressionTerritoryAliasId} className="card">
              <strong>{alias.value}</strong>

              <br />
              <br />

              <button
                type="button"
                className="btn danger"
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