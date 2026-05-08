import type { ProgressionZoneViewModel } from "../game/progressionZones";
import type { SelectedProgressionZoneKey } from "../model/progressionView.types";
import ProgressionBar from "./ProgressionBar";

type Props = {
    zones: ProgressionZoneViewModel[];
    selectedZoneKey: SelectedProgressionZoneKey;
    onSelectZone: (key: SelectedProgressionZoneKey) => void;
};

export default function ProgressionSidebar({
    zones,
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
                {zones.map((zone) => {
                    const percent =
                        zone.status === "unlocked" ? Math.min(100, zone.visitCount * 20) : 0;

                    return (
                        <ProgressionBar
                            key={zone.key}
                            label={zone.title}
                            percent={percent}
                            active={selectedZoneKey === zone.key}
                            locked={zone.status === "locked"}
                            onClick={() =>
                                onSelectZone(selectedZoneKey === zone.key ? null : zone.key)
                            }
                        />
                    );
                })}
            </div>
        </aside>
    );
}