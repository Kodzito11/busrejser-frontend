import type { ProgressionTerritoryAdminItem } from "../model/progressionTerritoryAdmin.types";

type Props = {
  items: ProgressionTerritoryAdminItem[];
  selectedId?: number | null;
  onEdit: (item: ProgressionTerritoryAdminItem) => void;
};

function yesNo(value: boolean) {
  return value ? "Ja" : "Nej";
}

export default function ProgressionTerritoryTable({
  items,
  selectedId,
  onEdit,
}: Props) {
  if (items.length === 0) {
    return <div className="card muted">Ingen progression territories endnu.</div>;
  }

  return (
    <div className="card">
      <h2>Territories</h2>
      <p className="muted">
        Disse områder styrer hvad progression map, quests og dashboard kan vise.
      </p>

      <br />

      <div className="tableWrap">
        <table className="legacyTable">
          <thead>
            <tr>
              <th>Navn</th>
              <th>Key</th>
              <th>Type</th>
              <th>Aktiv</th>
              <th>Synlig</th>
              <th>Coming soon</th>
              <th>Mastery</th>
              <th>Aliases</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.progressionTerritoryId}
                className={
                  selectedId === item.progressionTerritoryId ? "selected" : ""
                }
              >
                <td>
                  <strong>{item.name}</strong>
                </td>
                <td>{item.key}</td>
                <td>{item.type}</td>
                <td>{yesNo(item.isActive)}</td>
                <td>{yesNo(item.isVisible)}</td>
                <td>{yesNo(item.isComingSoon)}</td>
                <td>{item.masteryTarget}</td>
                <td>
                  {item.aliases.length === 0 ? (
                    <span className="muted">Ingen</span>
                  ) : (
                    item.aliases.map((x) => x.value).join(", ")
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => onEdit(item)}
                  >
                    Rediger
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}