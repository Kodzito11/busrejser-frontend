import municipalitiesGeoJson from "./geojson/denmark-municipalities.json";

export function extractAllMunicipalityNames(): string[] {
  const features =
    municipalitiesGeoJson.features ?? [];

  return features
    .map(
      (feature: any) =>
        feature?.properties?.label_dk
    )
    .filter(
      (x: unknown): x is string =>
        typeof x === "string" &&
        x.trim().length > 0
    )
    .sort((a, b) => a.localeCompare(b, "da"));
}