import type { ProgressionZoneViewModel } from "../game/progressionZones";
import { getZoneProgressionDetails } from "../game/progressionDetails";
import type { MunicipalityProgression } from "../game/municipalityProgression";

type Props = {
  zone: ProgressionZoneViewModel | null;
  municipalityProgression: MunicipalityProgression;
};

export default function ActiveZoneDetailCard({
  zone,
  municipalityProgression,
}: Props) {
  if (!zone) {
    return (
      <div className="active-zone-card active-zone-card--empty">
        <h3>Vælg en zone</h3>
        <p className="muted">
          Klik på et land eller en progression bar for at se detaljer.
        </p>
      </div>
    );
  }

  const details = getZoneProgressionDetails(zone);
  const isDenmark = zone.key === "dk";

  return (
    <div className="active-zone-card">
      <div className="active-zone-card__top">
        <div>
          <p className="muted">Aktiv zone</p>
          <h3>{zone.title}</h3>
        </div>

        <span
          className={`active-zone-card__status active-zone-card__status--${zone.status}`}
        >
          {zone.status === "unlocked" ? "Unlocked" : "Locked"}
        </span>
      </div>

      <div className="active-zone-card__percent">
        <strong>
          {isDenmark
            ? municipalityProgression.completionPercent
            : details.completionPercent}
          %
        </strong>
        <span className="muted">completion</span>
      </div>

      <div className="progression-bar-card__track">
        <div
          className="progression-bar-card__fill"
          style={{
            width: `${
              isDenmark
                ? municipalityProgression.completionPercent
                : details.completionPercent
            }%`,
          }}
        />
      </div>

      <div className="active-zone-card__stats">
        <div>
          <span className="muted">Besøg</span>
          <strong>{details.visitedText}</strong>
        </div>

        <div>
          <span className="muted">Tier</span>
          <strong>{details.tierName}</strong>
        </div>

        {isDenmark && (
          <div>
            <span className="muted">Kommuner</span>
            <strong>
              {municipalityProgression.visitedMunicipalityCount} /{" "}
              {municipalityProgression.totalMunicipalityCount}
            </strong>
          </div>
        )}
      </div>

      <div className="active-zone-card__next">
        <p className="muted">{details.missionTitle}</p>
        <ul>
          <li>{details.nextGoal}</li>
          <li>{details.statusText}</li>
        </ul>
      </div>
    </div>
  );
}