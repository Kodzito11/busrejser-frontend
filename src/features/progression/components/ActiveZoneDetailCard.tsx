import type { ProgressionZoneViewModel } from "../game/progressionZones";

type Props = {
  zone: ProgressionZoneViewModel | null;
};

export default function ActiveZoneDetailCard({ zone }: Props) {
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

  const percent = zone.status === "unlocked"
    ? Math.min(100, zone.visitCount * 20)
    : 0;

  return (
    <div className="active-zone-card">
      <div className="active-zone-card__top">
        <div>
          <p className="muted">Aktiv zone</p>
          <h3>{zone.title}</h3>
        </div>

        <span className={`active-zone-card__status active-zone-card__status--${zone.status}`}>
          {zone.status === "unlocked" ? "Unlocked" : "Locked"}
        </span>
      </div>

      <div className="active-zone-card__percent">
        <strong>{percent}%</strong>
        <span className="muted">completion</span>
      </div>

      <div className="progression-bar-card__track">
        <div
          className="progression-bar-card__fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="active-zone-card__stats">
        <div>
          <span className="muted">Besøg</span>
          <strong>{zone.visitCount}</strong>
        </div>

        <div>
          <span className="muted">Status</span>
          <strong>{zone.status === "unlocked" ? "Åben" : "Låst"}</strong>
        </div>
      </div>

      <div className="active-zone-card__next">
        <p className="muted">Næste mål</p>
        <ul>
          <li>Flere destinationer</li>
          <li>Kommuner</li>
          <li>Region completion</li>
        </ul>
      </div>
    </div>
  );
}