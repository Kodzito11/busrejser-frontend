import type { ProgressionTerritoryAdminItem } from "../model/progressionTerritoryAdmin.types";

type Props = {
  items: ProgressionTerritoryAdminItem[];
  selectedId?: number | null;
  onEdit: (item: ProgressionTerritoryAdminItem) => void;
};

function getTerritoryStatus(item: ProgressionTerritoryAdminItem) {
  if (item.isComingSoon) return "Coming soon";
  if (!item.isActive) return "Inaktiv";
  if (!item.isVisible) return "Skjult";

  return "Klar";
}

function getTerritoryStatusClass(item: ProgressionTerritoryAdminItem) {
  if (item.isComingSoon) {
    return "progression-admin-pill progression-admin-pill--soon";
  }

  if (!item.isActive || !item.isVisible) {
    return "progression-admin-pill progression-admin-pill--inactive";
  }

  return "progression-admin-pill progression-admin-pill--active";
}

export default function ProgressionTerritoryTable({
  items,
  selectedId,
  onEdit,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="card">
        <h2>Territories</h2>
        <p className="muted">Ingen progression territories endnu.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Territories</h2>
      <p className="muted">
        Disse områder styrer hvad progression map, quests og dashboard kan vise.
      </p>

      <br />

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Navn</th>
              <th>Key</th>
              <th>Type</th>
              <th>Status</th>
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
                  selectedId === item.progressionTerritoryId
                    ? "progression-admin-table-row-selected"
                    : ""
                }
              >
                <td>
                  <strong>{item.name}</strong>
                  {item.description && (
                    <>
                      <br />
                      <span className="muted">{item.description}</span>
                    </>
                  )}
                </td>

                <td>{item.key}</td>
                <td>{item.type}</td>

                <td>
                  <span className={getTerritoryStatusClass(item)}>
                    {getTerritoryStatus(item)}
                  </span>
                </td>

                <td>{item.masteryTarget}</td>

                <td>
                  {item.aliases.length === 0 ? (
                    <span className="muted">Ingen</span>
                  ) : (
                    <div className="progression-admin-alias-list">
                      {item.aliases.map((alias) => (
                        <span
                          key={alias.progressionTerritoryAliasId}
                          className="progression-admin-alias"
                        >
                          {alias.value}
                        </span>
                      ))}
                    </div>
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