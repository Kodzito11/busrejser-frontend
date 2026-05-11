import type {
  MunicipalityProgressItem,
  ProgressionStatus,
} from "../model/progression.types";

export type MapMunicipality = {
  name: string;
  region: string;
  visitCount: number;
  status: ProgressionStatus;
  completionPercent: number;
};

function normalize(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

export function findMapMunicipality(
  municipalities: MapMunicipality[],
  municipalityName: string
): MapMunicipality | null {
  const normalizedName = normalize(municipalityName);

  return (
    municipalities.find((municipality) => {
      return normalize(municipality.name) === normalizedName;
    }) ?? null
  );
}

export function buildMapMunicipalities(
  municipalities: MunicipalityProgressItem[]
): MapMunicipality[] {
  return municipalities.map((municipality) => ({
    name: municipality.name,
    region: municipality.region,
    visitCount: municipality.visitCount,
    status: municipality.status,
    completionPercent: municipality.completionPercent,
  }));
}