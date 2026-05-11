import { useEffect, useState } from "react";
import type {
  CreateProgressionTerritoryRequest,
  ProgressionTerritoryAdminItem,
  UpdateProgressionTerritoryRequest,
} from "../model/progressionTerritoryAdmin.types";

type FormState = {
  key: string;
  name: string;
  type: string;
  isActive: boolean;
  isVisible: boolean;
  isComingSoon: boolean;
  masteryTarget: number;
  description: string;
  aliasesText: string;
};

type Props = {
  selected: ProgressionTerritoryAdminItem | null;
  saving: boolean;
  onCancelEdit: () => void;
  onCreate: (payload: CreateProgressionTerritoryRequest) => Promise<void>;
  onUpdate: (
    id: number,
    payload: UpdateProgressionTerritoryRequest
  ) => Promise<void>;
};

const emptyForm: FormState = {
  key: "",
  name: "",
  type: "country",
  isActive: true,
  isVisible: true,
  isComingSoon: false,
  masteryTarget: 10,
  description: "",
  aliasesText: "",
};

export default function ProgressionTerritoryForm({
  selected,
  saving,
  onCancelEdit,
  onCreate,
  onUpdate,
}: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!selected) {
      setForm(emptyForm);
      return;
    }

    setForm({
      key: selected.key,
      name: selected.name,
      type: selected.type,
      isActive: selected.isActive,
      isVisible: selected.isVisible,
      isComingSoon: selected.isComingSoon,
      masteryTarget: selected.masteryTarget,
      description: selected.description ?? "",
      aliasesText: selected.aliases.map((x) => x.value).join(", "),
    });
  }, [selected]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const aliases = form.aliasesText
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (selected) {
      await onUpdate(selected.progressionTerritoryId, {
        key: form.key,
        name: form.name,
        type: form.type,
        isActive: form.isActive,
        isVisible: form.isVisible,
        isComingSoon: form.isComingSoon,
        masteryTarget: Number(form.masteryTarget),
        description: form.description || null,
      });

      return;
    }

    await onCreate({
      key: form.key,
      name: form.name,
      type: form.type,
      isActive: form.isActive,
      isVisible: form.isVisible,
      isComingSoon: form.isComingSoon,
      masteryTarget: Number(form.masteryTarget),
      description: form.description || null,
      aliases,
    });

    setForm(emptyForm);
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{selected ? "Rediger territory" : "Opret territory"}</h2>
      <p className="muted">
        Styr hvilke lande/områder progression-systemet må vise og bruge.
      </p>

      <br />

      <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <label>
          Key
          <input
            value={form.key}
            onChange={(e) => update("key", e.target.value)}
            placeholder="dk"
            required
          />
        </label>

        <label>
          Navn
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Danmark"
            required
          />
        </label>

        <label>
          Type
          <input
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
            placeholder="country"
            required
          />
        </label>

        <label>
          Mastery target
          <input
            type="number"
            min={1}
            value={form.masteryTarget}
            onChange={(e) => update("masteryTarget", Number(e.target.value))}
            required
          />
        </label>
      </div>

      <br />

      <label>
        Beskrivelse
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Valgfri admin/UX beskrivelse"
        />
      </label>

      {!selected && (
        <>
          <br />
          <label>
            Aliases ved oprettelse
            <input
              value={form.aliasesText}
              onChange={(e) => update("aliasesText", e.target.value)}
              placeholder="danmark, denmark, dk"
            />
          </label>
        </>
      )}

      {selected && (
        <>
          <br />
          <p className="muted">
            Aliases redigeres i alias-sektionen under tabellen.
          </p>
        </>
      )}

      <br />

      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <label>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
          />{" "}
          Aktiv
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.isVisible}
            onChange={(e) => update("isVisible", e.target.checked)}
          />{" "}
          Synlig
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.isComingSoon}
            onChange={(e) => update("isComingSoon", e.target.checked)}
          />{" "}
          Coming soon
        </label>
      </div>

      <br />

      <div className="row-actions">
        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Gemmer..." : selected ? "Gem ændringer" : "Opret"}
        </button>

        {selected && (
          <button
            type="button"
            className="btn secondary"
            onClick={onCancelEdit}
            disabled={saving}
          >
            Annuller edit
          </button>
        )}
      </div>
    </form>
  );
}