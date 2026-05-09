import type { VisitedLocationMapItem } from "../model/progression.types";

export type MunicipalityProgression = {
  visitedMunicipalityCount: number;
  totalMunicipalityCount: number;
  completionPercent: number;
  visitedMunicipalities: string[];
};

const TOTAL_DK_MUNICIPALITIES = 98;

function normalize(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

export function getDenmarkMunicipalityProgression(
  locations: VisitedLocationMapItem[]
): MunicipalityProgression {
  const visitedMunicipalities = Array.from(
    new Set(
      locations
        .filter((x) => normalize(x.country) === "denmark" || normalize(x.country) === "danmark")
        .map((x) => x.municipality)
        .filter((x): x is string => Boolean(x && x.trim()))
        .map((x) => x.trim())
    )
  ).sort((a, b) => a.localeCompare(b, "da"));

  const visitedMunicipalityCount = visitedMunicipalities.length;

  return {
    visitedMunicipalityCount,
    totalMunicipalityCount: TOTAL_DK_MUNICIPALITIES,
    completionPercent: Math.round(
      (visitedMunicipalityCount / TOTAL_DK_MUNICIPALITIES) * 100
    ),
    visitedMunicipalities,
  };
}