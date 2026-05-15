import type { MapTerritory } from "./mapTerritoryAdapter";

function normalize(value?: string | null) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace("å", "a")
    .replace("ä", "a")
    .replace("ö", "o")
    .replace(" ", "-");
}

export function getSwedenRegionNameFromFeature(feature: any) {
  return (
    feature?.properties?.name ??
    feature?.properties?.NAME ??
    feature?.properties?.label ??
    feature?.properties?.region ??
    "Svensk region"
  );
}

export function getSwedenRegionKeyFromFeature(feature: any) {
  const name = getSwedenRegionNameFromFeature(feature);
  return `se-${normalize(name)}`;
}

export function findSwedenRegionTerritory(
  territories: MapTerritory[],
  feature: any
) {
  const key = getSwedenRegionKeyFromFeature(feature);

  return (
    territories.find((territory) => territory.key.toLowerCase() === key) ??
    null
  );
}

export function getSwedenRegionTooltipText(
  feature: any,
  territory: MapTerritory | null
) {
  const name = getSwedenRegionNameFromFeature(feature);

  if (!territory) {
    return `${name} · locked`;
  }

  return `${territory.name} · ${territory.status} · ${territory.completionPercent}%`;
}