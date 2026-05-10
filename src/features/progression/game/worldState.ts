import type { VisitedLocationMapItem } from "../model/progression.types";

export type WorldTerritoryState =
  | "unknown"
  | "known"
  | "unlocked"
  | "mastered";

export type MunicipalityWorldState = {
  municipalityName: string;
  state: WorldTerritoryState;

  visitCount: number;

  discovered: boolean;
  unlocked: boolean;
  mastered: boolean;

  fogOpacity: number;
};

export type WorldState = {
  municipalities: MunicipalityWorldState[];

  totals: {
    unknown: number;
    known: number;
    unlocked: number;
    mastered: number;
  };
};

function normalize(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

function getMunicipalityVisitCount(
  municipalityName: string,
  locations: VisitedLocationMapItem[]
) {
  return locations
    .filter(
      (x) =>
        normalize(x.municipality) === normalize(municipalityName)
    )
    .reduce((sum, x) => sum + x.visitCount, 0);
}

function resolveTerritoryState(
  visitCount: number
): WorldTerritoryState {
  if (visitCount >= 10) {
    return "mastered";
  }

  if (visitCount >= 1) {
    return "unlocked";
  }

  return "unknown";
}

function resolveFogOpacity(state: WorldTerritoryState) {
  switch (state) {
    case "mastered":
      return 0;

    case "unlocked":
      return 0.15;

    case "known":
      return 0.45;

    case "unknown":
    default:
      return 0.8;
  }
}

export function buildWorldState(
  allMunicipalityNames: string[],
  locations: VisitedLocationMapItem[]
): WorldState {
  const municipalities: MunicipalityWorldState[] =
    allMunicipalityNames.map((municipalityName) => {
      const visitCount = getMunicipalityVisitCount(
        municipalityName,
        locations
      );

      const state = resolveTerritoryState(visitCount);

      return {
        municipalityName,

        state,

        visitCount,

        discovered: state !== "unknown",

        unlocked:
          state === "unlocked" ||
          state === "mastered",

        mastered: state === "mastered",

        fogOpacity: resolveFogOpacity(state),
      };
    });

  return {
    municipalities,

    totals: {
      unknown: municipalities.filter(
        (x) => x.state === "unknown"
      ).length,

      known: municipalities.filter(
        (x) => x.state === "known"
      ).length,

      unlocked: municipalities.filter(
        (x) => x.state === "unlocked"
      ).length,

      mastered: municipalities.filter(
        (x) => x.state === "mastered"
      ).length,
    },
  };
}