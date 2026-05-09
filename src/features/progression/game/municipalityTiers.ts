export type MunicipalityTier = {
  name: string;
  minVisits: number;
  label: string;
  description: string;
};

export const MUNICIPALITY_TIERS: MunicipalityTier[] = [
  {
    name: "unvisited",
    minVisits: 0,
    label: "Uopdaget",
    description: "Du har endnu ikke besøgt denne kommune.",
  },
  {
    name: "visited",
    minVisits: 1,
    label: "Besøgt",
    description: "Du har sat fod i kommunen.",
  },
  {
    name: "familiar",
    minVisits: 3,
    label: "Kendt område",
    description: "Du begynder at kende området.",
  },
  {
    name: "established",
    minVisits: 5,
    label: "Etableret",
    description: "Kommunen er blevet en fast del af dit rejsekort.",
  },
  {
    name: "mastered",
    minVisits: 10,
    label: "Mestret",
    description: "Du har virkelig udforsket denne kommune.",
  },
];

export function getMunicipalityTier(visitCount: number): MunicipalityTier {
  return [...MUNICIPALITY_TIERS]
    .reverse()
    .find((tier) => visitCount >= tier.minVisits)!;
}