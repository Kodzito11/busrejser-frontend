import type { LatLngExpression } from "leaflet";
import type { SelectedProgressionZoneKey } from "../model/progressionView.types";

export type MapCameraConfig = {
  center: LatLngExpression;
  zoom: number;
};

export const defaultMapCamera: MapCameraConfig = {
  center: [55.6761, 12.5683],
  zoom: 5,
};

const denmarkCamera: MapCameraConfig = {
  center: [56.2639, 9.5018],
  zoom: 7,
};

const germanyCamera: MapCameraConfig = {
  center: [51.1657, 10.4515],
  zoom: 6,
};

const swedenCamera: MapCameraConfig = {
  center: [60.1282, 18.6435],
  zoom: 5,
};

const mapCameraByTerritoryKey: Record<string, MapCameraConfig> = {
  dk: denmarkCamera,
  denmark: denmarkCamera,
  danmark: denmarkCamera,

  germany: germanyCamera,
  de: germanyCamera,
  tyskland: germanyCamera,

  prague: {
    center: [50.0755, 14.4378],
    zoom: 10,
  },

  netherlands: {
    center: [52.1326, 5.2913],
    zoom: 7,
  },

  sweden: swedenCamera,
  se: swedenCamera,
  sverige: swedenCamera,

  norway: {
    center: [60.472, 8.4689],
    zoom: 5,
  },
};

export function getMapCameraForTerritory(
  selectedZoneKey: SelectedProgressionZoneKey
): MapCameraConfig {
  if (!selectedZoneKey) return defaultMapCamera;

  const key = selectedZoneKey.trim().toLowerCase();

  if (key.startsWith("se-")) return swedenCamera;
  if (key.startsWith("de-") || key.startsWith("germany-")) return germanyCamera;

  return mapCameraByTerritoryKey[key] ?? defaultMapCamera;
}