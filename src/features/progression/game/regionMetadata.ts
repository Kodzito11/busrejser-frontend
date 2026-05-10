export type RegionMetadata = {
  key: string;
  name: string;

  country: string;

  municipalityCount: number;

  difficulty: "starter" | "normal" | "advanced";

  unlocks?: string[];

  isCapitalRegion?: boolean;
};

export const regionMetadata: RegionMetadata[] = [
  {
    key: "capital",
    name: "Hovedstaden",
    country: "Denmark",
    municipalityCount: 29,
    difficulty: "starter",
    isCapitalRegion: true,
    unlocks: ["zealand"],
  },

  {
    key: "zealand",
    name: "Sjælland",
    country: "Denmark",
    municipalityCount: 17,
    difficulty: "normal",
    unlocks: ["fyn"],
  },

  {
    key: "fyn",
    name: "Syddanmark",
    country: "Denmark",
    municipalityCount: 22,
    difficulty: "normal",
    unlocks: ["midtjylland"],
  },

  {
    key: "midtjylland",
    name: "Midtjylland",
    country: "Denmark",
    municipalityCount: 19,
    difficulty: "advanced",
    unlocks: ["nordjylland"],
  },

  {
    key: "nordjylland",
    name: "Nordjylland",
    country: "Denmark",
    municipalityCount: 11,
    difficulty: "advanced",
  },
];

export function getRegionMetadata(
  regionName: string
): RegionMetadata | null {
  return (
    regionMetadata.find(
      (x) =>
        x.name.trim().toLowerCase() ===
        regionName.trim().toLowerCase()
    ) ?? null
  );
}