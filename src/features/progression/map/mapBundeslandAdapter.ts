import type { MapTerritory } from "./mapTerritoryAdapter";

const bundeslandKeyFromId: Record<string, string> = {
  "DE-BW": "de-bw",
  "DE-BY": "de-by",
  "DE-BE": "de-be",
  "DE-BB": "de-bb",
  "DE-HB": "de-hb",
  "DE-HH": "de-hh",
  "DE-HE": "de-he",
  "DE-MV": "de-mv",
  "DE-NI": "de-ni",
  "DE-NW": "de-nw",
  "DE-RP": "de-rp",
  "DE-SL": "de-sl",
  "DE-SN": "de-sn",
  "DE-ST": "de-st",
  "DE-SH": "de-sh",
  "DE-TH": "de-th",
};

export function getBundeslandKeyFromFeature(feature: any) {
  const id = feature?.properties?.id;
  return bundeslandKeyFromId[id] ?? null;
}

export function findBundeslandTerritory(
  territories: MapTerritory[],
  feature: any
) {
  const key = getBundeslandKeyFromFeature(feature);

  if (!key) return null;

  return territories.find(
    (territory) => territory.key.toLowerCase() === key
  ) ?? null;
}

export function getBundeslandTooltipText(feature: any, territory: MapTerritory | null) {
  const name = feature?.properties?.name ?? "Bundesland";

  if (!territory) {
    return `${name} · locked`;
  }

  return `${territory.name} · ${territory.status} · ${territory.completionPercent}%`;
}