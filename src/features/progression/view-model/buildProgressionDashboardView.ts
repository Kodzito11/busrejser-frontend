import type {
  MunicipalityProgressItem,
  ProgressionMapResponse,
  TerritoryProgressItem,
} from "../model/progression.types";
import type { SelectedProgressionZoneKey } from "../model/progressionView.types";

export type ProgressionDashboardView = {
  territories: TerritoryProgressItem[];
  municipalities: MunicipalityProgressItem[];
  selectedTerritory: TerritoryProgressItem | null;
  selectedMunicipality: MunicipalityProgressItem | null;
  stats: {
    visitedLocationCount: number;
    visitedCountryCount: number;
    territoryCount: number;
    municipalityCount: number;
  };
};

type Args = {
  data: ProgressionMapResponse;
  selectedZoneKey: SelectedProgressionZoneKey;
  selectedMunicipalityName: string | null;
};

export function buildProgressionDashboardView({
  data,
  selectedZoneKey,
  selectedMunicipalityName,
}: Args): ProgressionDashboardView {
  const territories = data.territories ?? [];
  const municipalities = data.municipalities ?? [];

  const selectedTerritory =
    selectedZoneKey != null
      ? territories.find((x) => x.key === selectedZoneKey) ?? null
      : null;

  const selectedMunicipality =
    selectedMunicipalityName != null
      ? municipalities.find(
          (x) =>
            normalize(x.name) === normalize(selectedMunicipalityName)
        ) ?? null
      : null;

  return {
    territories,
    municipalities,
    selectedTerritory,
    selectedMunicipality,
    stats: {
      visitedLocationCount: data.visitedLocationCount,
      visitedCountryCount: data.visitedCountryCount,
      territoryCount: territories.length,
      municipalityCount: municipalities.length,
    },
  };
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}