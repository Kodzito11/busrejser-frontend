import type { TerritoryProgressItem } from "../model/progression.types";
import type { SelectedProgressionZoneKey } from "../model/progressionView.types";
import ProgressionBar from "./ProgressionBar";

type Props = {
  territories: TerritoryProgressItem[];
  selectedZoneKey: SelectedProgressionZoneKey;
  onSelectZone: (key: SelectedProgressionZoneKey) => void;
};

export default function ProgressionSidebar({
  territories,
  selectedZoneKey,
  onSelectZone,
}: Props) {
  return (
    <aside className="progression-sidebar">
      <div>
        <h3>Zone progression</h3>
        <p className="muted">Vælg et område for detaljer.</p>
      </div>

      <div className="progression-sidebar__list">
        {territories.map((territory) => (
  <ProgressionBar
    key={territory.key}
    label={territory.name}
    percent={territory.completionPercent}
    active={selectedZoneKey === territory.key}
    locked={territory.status === "locked"}
    onClick={() =>
      onSelectZone(selectedZoneKey === territory.key ? null : territory.key)
    }
  />
))}
      </div>
    </aside>
  );
}