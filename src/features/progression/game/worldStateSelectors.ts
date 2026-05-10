import type {
  MunicipalityWorldState,
  WorldState,
} from "./worldState";

function normalize(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

export function getMunicipalityWorldState(
  worldState: WorldState,
  municipalityName: string
): MunicipalityWorldState | null {
  return (
    worldState.municipalities.find(
      (x) =>
        normalize(x.municipalityName) ===
        normalize(municipalityName)
    ) ?? null
  );
}

export function isMunicipalityUnlocked(
  worldState: WorldState,
  municipalityName: string
) {
  const state = getMunicipalityWorldState(
    worldState,
    municipalityName
  );

  return state?.unlocked ?? false;
}

export function isMunicipalityMastered(
  worldState: WorldState,
  municipalityName: string
) {
  const state = getMunicipalityWorldState(
    worldState,
    municipalityName
  );

  return state?.mastered ?? false;
}

export function getMunicipalityFogOpacity(
  worldState: WorldState,
  municipalityName: string
) {
  const state = getMunicipalityWorldState(
    worldState,
    municipalityName
  );

  return state?.fogOpacity ?? 0.8;
}

export function getMunicipalityVisitCount(
  worldState: WorldState,
  municipalityName: string
) {
  const state = getMunicipalityWorldState(
    worldState,
    municipalityName
  );

  return state?.visitCount ?? 0;
}