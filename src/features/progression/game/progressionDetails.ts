import type { ProgressionZoneViewModel } from "./progressionZones";

export type ZoneProgressionDetails = {
  completionPercent: number;
  tierName: string;
  visitedText: string;
  nextGoal: string;
  missionTitle: string;
  statusText: string;
};

export function getZoneProgressionDetails(
  zone: ProgressionZoneViewModel
): ZoneProgressionDetails {

  if (zone.status === "locked") {
    return {
      completionPercent: 0,
      tierName: "Locked",
      visitedText: "Ingen besøg endnu",
      nextGoal: "Besøg området for at låse det op",
      missionTitle: "Lås området op",
      statusText: "Zonen er fuldt udforsket",
    };
  }

  if (zone.visitCount >= 10) {
    return {
      completionPercent: 100,
      tierName: "Master Explorer",
      visitedText: `${zone.visitCount} besøg registreret`,
      nextGoal: "Alle kernemål fuldført",
      missionTitle: "Zone mestring",
      statusText: "Zonen er låst op",
    };
  }

  if (zone.visitCount >= 5) {
    return {
      completionPercent: 70,
      tierName: "Explorer",
      visitedText: `${zone.visitCount} besøg registreret`,
      nextGoal: "Besøg flere destinationer",
      missionTitle: "Første ekspedition",
      statusText: "Zonen er låst op",
    };
  }

  return {
    completionPercent: 30,
    tierName: "Traveler",
    visitedText: `${zone.visitCount} besøg registreret`,
    nextGoal: "Opdag nye områder",
    missionTitle: "Første ekspedition",
    statusText: "Zonen er låst op",
  };
}