import type {
  MunicipalityProgressItem,
  TerritoryProgressItem,
} from "../model/progression.types";

type Props = {
  territory: TerritoryProgressItem | null;
  municipalities: MunicipalityProgressItem[];
  selectedMunicipalityName: string | null;
};

function formatStatus(status: string) {
  if (status === "locked") return "Locked";
  if (status === "unlocked") return "Unlocked";
  if (status === "mastered") return "Mastered";

  return status;
}

function getProgressionHint(status: string, type: "territory" | "municipality") {
  if (status === "locked") {
    return type === "municipality"
      ? "Tag en rejse hertil for at opdage kommunen."
      : "Tag din første rejse hertil for at unlocke området.";
  }

  if (status === "mastered") {
    return type === "municipality"
      ? "Kommunen er mastered. Flot."
      : "Området er mastered. Klar til næste territory.";
  }

  return type === "municipality"
    ? "Kommunen er unlocked. Flere besøg øger progressionen."
    : "Området er unlocked. Udforsk flere steder for højere completion.";
}

function getTopMunicipalities(municipalities: MunicipalityProgressItem[]) {
  return [...municipalities]
    .filter((municipality) => municipality.visitCount > 0 || municipality.status !== "locked")
    .sort(
      (a, b) =>
        b.completionPercent - a.completionPercent ||
        b.visitCount - a.visitCount ||
        a.name.localeCompare(b.name, "da")
    )
    .slice(0, 5);
}

export default function ActiveZoneDetailCard({
  territory,
  municipalities,
  selectedMunicipalityName,
}: Props) {
  const selectedMunicipality = selectedMunicipalityName
    ? municipalities.find(
        (x) => x.name.toLowerCase() === selectedMunicipalityName.toLowerCase()
      ) ?? null
    : null;

  const topMunicipalities = getTopMunicipalities(municipalities);

  if (selectedMunicipality) {
    const hint = getProgressionHint(selectedMunicipality.status, "municipality");

    return (
      <div className="active-zone-card">
        <div className="active-zone-card__top">
          <div>
            <p className="muted">Aktiv kommune</p>
            <h3>{selectedMunicipality.name}</h3>
          </div>

          <span
            className={`active-zone-card__status active-zone-card__status--${selectedMunicipality.status}`}
          >
            {formatStatus(selectedMunicipality.status)}
          </span>
        </div>

        <div className="active-zone-card__percent">
          <strong>{selectedMunicipality.completionPercent}%</strong>
          <span className="muted">completion</span>
        </div>

        <div className="progression-bar-card__track">
          <div
            className="progression-bar-card__fill"
            style={{ width: `${selectedMunicipality.completionPercent}%` }}
          />
        </div>

        <div className="active-zone-card__stats">
          <div>
            <span className="muted">Region</span>
            <strong>{selectedMunicipality.region}</strong>
          </div>

          <div>
            <span className="muted">Besøg</span>
            <strong>{selectedMunicipality.visitCount}</strong>
          </div>

          <div>
            <span className="muted">Status</span>
            <strong>{formatStatus(selectedMunicipality.status)}</strong>
          </div>
        </div>

        <div className="active-zone-card__next">
          <p className="muted">Kommune progression</p>
          <ul>
            <li>{hint}</li>
            <li>
              Denne kommune tæller med i {selectedMunicipality.region} progression.
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (!territory) {
    return (
      <div className="active-zone-card active-zone-card--empty">
        <h3>Vælg en zone</h3>
        <p className="muted">
          Klik på et land eller en progression bar for at se detaljer.
        </p>
      </div>
    );
  }

  const hint = getProgressionHint(territory.status, "territory");

  return (
    <div className="active-zone-card">
      <div className="active-zone-card__top">
        <div>
          <p className="muted">Aktiv zone</p>
          <h3>{territory.name}</h3>
        </div>

        <span
          className={`active-zone-card__status active-zone-card__status--${territory.status}`}
        >
          {formatStatus(territory.status)}
        </span>
      </div>

      <div className="active-zone-card__percent">
        <strong>{territory.completionPercent}%</strong>
        <span className="muted">completion</span>
      </div>

      <div className="progression-bar-card__track">
        <div
          className="progression-bar-card__fill"
          style={{ width: `${territory.completionPercent}%` }}
        />
      </div>

      <div className="active-zone-card__stats">
        <div>
          <span className="muted">Type</span>
          <strong>{territory.type}</strong>
        </div>

        <div>
          <span className="muted">Besøg</span>
          <strong>{territory.visitCount}</strong>
        </div>

        <div>
          <span className="muted">Status</span>
          <strong>{formatStatus(territory.status)}</strong>
        </div>
      </div>

      <div className="active-zone-card__next">
        <p className="muted">Næste mål</p>
        <ul>
          <li>{hint}</li>
        </ul>
      </div>

      {topMunicipalities.length > 0 && (
        <div className="active-zone-card__next">
          <p className="muted">Top kommuner</p>

          <ul>
            {topMunicipalities.map((municipality) => (
              <li key={municipality.name}>
                <strong>{municipality.name}</strong>{" "}
                <span className="muted">
                  · {formatStatus(municipality.status)} ·{" "}
                  {municipality.completionPercent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}