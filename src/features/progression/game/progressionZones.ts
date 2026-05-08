import type { VisitedLocationMapItem } from "../model/progression.types";

export type ProgressionZoneStatus = "locked" | "unlocked";

export type ProgressionZone = {
  key: "dk" | "germany" | "prague";
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  matchCountries: string[];
  matchNames: string[];
};

export type ProgressionZoneViewModel = ProgressionZone & {
  status: ProgressionZoneStatus;
  visitCount: number;
};

export const progressionZones: ProgressionZone[] = [
  {
    key: "dk",
    title: "Danmark",
    description: "Startzonen. Første skridt på rejsekortet.",
    latitude: 56.2639,
    longitude: 9.5018,
    matchCountries: ["dk", "danmark", "denmark"],
    matchNames: ["københavn", "koebenhavn", "copenhagen", "aarhus", "odense", "aalborg"],
  },
  {
    key: "germany",
    title: "Tyskland",
    description: "Lås Centraleuropa op med din første tyske destination.",
    latitude: 51.1657,
    longitude: 10.4515,
    matchCountries: ["de", "tyskland", "germany"],
    matchNames: ["berlin", "hamburg", "munich", "münchen", "koln", "köln"],
  },
  {
    key: "prague",
    title: "Prag",
    description: "En særlig by-zone for Prag-eventyret.",
    latitude: 50.0755,
    longitude: 14.4378,
    matchCountries: ["cz", "czechia", "czech republic", "tjekkiet"],
    matchNames: ["prague", "praha", "prag"],
  },
];

function normalize(value?: string | null) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace("æ", "ae")
    .replace("ø", "o")
    .replace("å", "a");
}

function locationMatchesZone(
  location: VisitedLocationMapItem,
  zone: ProgressionZone
) {
  const country = normalize(location.country);
  const name = normalize(location.name);
  const region = normalize(location.region);
  const municipality = normalize(location.municipality);

  const countryMatch = zone.matchCountries
    .map(normalize)
    .includes(country);

  const nameMatch = zone.matchNames
    .map(normalize)
    .some((match) =>
      [name, region, municipality].some((value) => value.includes(match))
    );

  return countryMatch || nameMatch;
}

export function buildProgressionZones(
  locations: VisitedLocationMapItem[]
): ProgressionZoneViewModel[] {
  return progressionZones.map((zone) => {
    const matchedLocations = locations.filter((location) =>
      locationMatchesZone(location, zone)
    );

    const visitCount = matchedLocations.reduce(
      (sum, location) => sum + location.visitCount,
      0
    );

    return {
      ...zone,
      status: matchedLocations.length > 0 ? "unlocked" : "locked",
      visitCount,
    };
  });
}