export type MunicipalityMetadata = {
  name: string;
  region: string;
  isMajor?: boolean;
  tags?: string[];
};

export const MUNICIPALITY_METADATA: Record<string, MunicipalityMetadata> = {
  København: {
    name: "København",
    region: "Hovedstaden",
    isMajor: true,
    tags: ["capital", "urban", "starter-zone"],
  },

  Frederiksberg: {
    name: "Frederiksberg",
    region: "Hovedstaden",
    isMajor: true,
    tags: ["urban"],
  },

  Roskilde: {
    name: "Roskilde",
    region: "Sjælland",
    isMajor: true,
    tags: ["historic", "festival"],
  },

  Aarhus: {
    name: "Aarhus",
    region: "Midtjylland",
    isMajor: true,
    tags: ["major-city", "urban"],
  },

  Odense: {
    name: "Odense",
    region: "Syddanmark",
    isMajor: true,
    tags: ["major-city", "historic"],
  },

  Aalborg: {
    name: "Aalborg",
    region: "Nordjylland",
    isMajor: true,
    tags: ["major-city", "northern"],
  },
};

export function getMunicipalityMetadata(name: string): MunicipalityMetadata {
  return (
    MUNICIPALITY_METADATA[name] ?? {
      name,
      region: "Ukendt region",
      isMajor: false,
      tags: [],
    }
  );
}