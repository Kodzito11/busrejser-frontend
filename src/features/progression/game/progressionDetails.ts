import type { ProgressionZoneViewModel } from "./progressionZones";

export type ZoneProgressionDetails = {
  completionPercent: number;
  tierName: string;
  visitedText: string;
  nextGoal: string;
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
    };
  }

  if (zone.visitCount >= 10) {
    return {
      completionPercent: 100,
      tierName: "Master Explorer",
      visitedText: `${zone.visitCount} besøg registreret`,
      nextGoal: "Alle kernemål fuldført",
    };
  }

  if (zone.visitCount >= 5) {
    return {
      completionPercent: 70,
      tierName: "Explorer",
      visitedText: `${zone.visitCount} besøg registreret`,
      nextGoal: "Besøg flere destinationer",
    };
  }

  return {
    completionPercent: 30,
    tierName: "Traveler",
    visitedText: `${zone.visitCount} besøg registreret`,
    nextGoal: "Opdag nye områder",
  };
}