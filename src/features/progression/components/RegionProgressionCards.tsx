import type { RegionProgression } from "../game/regionProgression";

type Props = {
  regions: RegionProgression[];
};

export default function RegionProgressionCards({
  regions,
}: Props) {
  return (
    <div className="progression-region-grid">
      {regions.map((region) => (
        <div
          key={region.key}
          className={`progression-region-card ${
            region.mastered
              ? "progression-region-card--mastered"
              : region.unlocked
              ? "progression-region-card--unlocked"
              : "progression-region-card--locked"
          }`}
        >
          <div className="progression-region-card__top">
            <div>
              <p className="muted">Region</p>
              <h3>{region.regionName}</h3>
            </div>

            <span>
              {region.mastered
                ? "👑 Mastered"
                : region.unlocked
                ? "🟢 Unlocked"
                : "🔒 Locked"}
            </span>
          </div>

          <div className="progression-region-card__progress">
            <strong>{region.completionPercent}%</strong>
            <span className="muted">completion</span>
          </div>

          <div className="progression-bar-card__track">
            <div
              className="progression-bar-card__fill"
              style={{
                width: `${region.completionPercent}%`,
              }}
            />
          </div>

          <div className="progression-region-card__stats">
            <div>
              <span className="muted">Kommuner</span>

              <strong>
                {region.visitedMunicipalityCount} /{" "}
                {region.municipalityCount}
              </strong>
            </div>

            <div>
              <span className="muted">Besøg</span>

              <strong>{region.totalVisits}</strong>
            </div>

            <div>
              <span className="muted">Difficulty</span>

              <strong>{region.difficulty}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}