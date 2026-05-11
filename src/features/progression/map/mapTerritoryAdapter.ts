import type { FeatureCollection, Geometry } from "geojson";
import type {
  ProgressionStatus,
  TerritoryProgressItem,
} from "../model/progression.types";
import { progressionZones } from "../game/progressionZones";

export type MapTerritory = {
  key: string;
  name: string;
  type: string;
  visitCount: number;
  status: ProgressionStatus;
  completionPercent: number;

  description: string;
  latitude: number;
  longitude: number;
  polygon?: [number, number][];
  geoJson?: FeatureCollection<Geometry>;
};

const fallbackTerritoryPosition = {
  latitude: 55.6761,
  longitude: 12.5683,
};

const territoryKeyAliases: Record<string, string> = {
  dk: "dk",
  denmark: "dk",
  danmark: "dk",

  germany: "germany",
  de: "germany",
  tyskland: "germany",

  prague: "prague",
  prag: "prague",
  praha: "prague",
  czechia: "prague",
  tjekkiet: "prague",
  "czech-republic": "prague",

  netherlands: "netherlands",
  holland: "netherlands",

  sweden: "sweden",
  sverige: "sweden",

  norway: "norway",
  norge: "norway",
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function resolveStaticZoneKey(key: string) {
  const normalized = normalizeKey(key);
  return territoryKeyAliases[normalized] ?? normalized;
}

export function buildMapTerritories(
  territories: TerritoryProgressItem[]
): MapTerritory[] {
  return territories.map((territory) => {
    const staticKey = resolveStaticZoneKey(territory.key);
    const staticZone = progressionZones.find((zone) => zone.key === staticKey);

    return {
      key: territory.key,
      name: territory.name,
      type: territory.type,
      visitCount: territory.visitCount,
      status: territory.status,
      completionPercent: territory.completionPercent,

      description:
        staticZone?.description ??
        `${territory.name} progression område.`,

      latitude: staticZone?.latitude ?? fallbackTerritoryPosition.latitude,
      longitude: staticZone?.longitude ?? fallbackTerritoryPosition.longitude,
      polygon: staticZone?.polygon,
      geoJson: staticZone?.geoJson,
    };
  });
}