import type { VisitedLocationMapItem } from "../model/progression.types";

import {
  regionMetadata,
} from "./regionMetadata";

export type RegionProgression = {
  key: string;

  regionName: string;

  municipalityCount: number;
  visitedMunicipalityCount: number;

  completionPercent: number;

  unlocked: boolean;
  mastered: boolean;

  totalVisits: number;

  difficulty: string;
};

function normalize(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

export function buildRegionProgression(
  locations: VisitedLocationMapItem[]
): RegionProgression[] {
  return regionMetadata.map((region) => {
    const regionLocations = locations.filter(
      (x) =>
        normalize(x.region) ===
        normalize(region.name)
    );

    const visitedMunicipalities = Array.from(
      new Set(
        regionLocations
          .map((x) => x.municipality)
          .filter(Boolean)
      )
    );

    const totalVisits = regionLocations.reduce(
      (sum, x) => sum + x.visitCount,
      0
    );

    const visitedMunicipalityCount =
      visitedMunicipalities.length;

    const completionPercent = Math.round(
      (visitedMunicipalityCount /
        region.municipalityCount) *
        100
    );

    return {
      key: region.key,

      regionName: region.name,

      municipalityCount:
        region.municipalityCount,

      visitedMunicipalityCount,

      completionPercent,

      unlocked: visitedMunicipalityCount > 0,

      mastered: completionPercent >= 80,

      totalVisits,

      difficulty: region.difficulty,
    };
  });
}

export function getRegionProgression(
  regionName: string,
  progression: RegionProgression[]
): RegionProgression | null {
  return (
    progression.find(
      (x) =>
        normalize(x.regionName) ===
        normalize(regionName)
    ) ?? null
  );
}