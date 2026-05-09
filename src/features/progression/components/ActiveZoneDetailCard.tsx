import type { ProgressionZoneViewModel } from "../game/progressionZones";
import { getZoneProgressionDetails } from "../game/progressionDetails";
import type { MunicipalityProgression } from "../game/municipalityProgression";
import type { VisitedLocationMapItem } from "../model/progression.types";

import { getMunicipalityTier } from "../game/municipalityTiers";
import { getMunicipalityObjectives } from "../game/municipalityObjectives";
import { getMunicipalityMetadata } from "../game/municipalityMetadata";

type Props = {
  zone: ProgressionZoneViewModel | null;
  locations: VisitedLocationMapItem[];
  municipalityProgression: MunicipalityProgression;
  selectedMunicipalityName: string | null;
};

export default function ActiveZoneDetailCard({
  zone,
  locations,
  municipalityProgression,
  selectedMunicipalityName,
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

  if (isDenmark && selectedMunicipalityName) {
    const visits = locations.filter(
      (x) =>
        x.municipality?.toLowerCase() ===
        selectedMunicipalityName.toLowerCase()
    );

    const visitCount = visits.reduce((sum, x) => sum + x.visitCount, 0);
    const tier = getMunicipalityTier(visitCount);
    const metadata = getMunicipalityMetadata(selectedMunicipalityName);
    const objectives = getMunicipalityObjectives(
      selectedMunicipalityName,
      locations
    );

    return (
      <div className="active-zone-card">
        <div className="active-zone-card__top">
          <div>
            <p className="muted">Aktiv kommune</p>
            <h3>{selectedMunicipalityName}</h3>
          </div>

          <span className="active-zone-card__status active-zone-card__status--unlocked">
            {visitCount > 0 ? "Besøgt" : "Uopdaget"}
          </span>
        </div>

        <div className="active-zone-card__percent">
          <strong>{visitCount}</strong>
          <span className="muted">
            {visitCount === 1 ? "besøg" : "besøg"}
          </span>
        </div>

        <div className="active-zone-card__stats">
          <div>
            <span className="muted">Region</span>
            <strong>{metadata.region}</strong>
          </div>

          <div>
            <span className="muted">Tier</span>
            <strong>{tier.label}</strong>
          </div>

          <div>
            <span className="muted">Status</span>
            <strong>{visitCount > 0 ? "Unlocked" : "Locked"}</strong>
          </div>
        </div>

        <div className="active-zone-card__next">
          <p className="muted">{tier.description}</p>

          <ul>
            {objectives.map((objective) => (
              <li key={objective.id}>
                {objective.completed ? "✅" : "⬜"} {objective.title} —{" "}
                {objective.progressText}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

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