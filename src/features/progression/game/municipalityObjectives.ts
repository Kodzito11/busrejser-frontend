import type { VisitedLocationMapItem } from "../model/progression.types";
import { getMunicipalityMetadata } from "./municipalityMetadata";

export type MunicipalityObjective = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progressText: string;
};

export function getMunicipalityObjectives(
  municipalityName: string,
  locations: VisitedLocationMapItem[]
): MunicipalityObjective[] {
  const visits = locations.filter(
    (x) => x.municipality?.toLowerCase() === municipalityName.toLowerCase()
  );

  const visitCount = visits.reduce((sum, x) => sum + x.visitCount, 0);
  const metadata = getMunicipalityMetadata(municipalityName);

  return [
    {
      id: "first-visit",
      title: "Første besøg",
      description: `Besøg ${municipalityName} mindst én gang.`,
      completed: visitCount >= 1,
      progressText: `${Math.min(visitCount, 1)} / 1 besøg`,
    },
    {
      id: "return-trip",
      title: "Tilbage igen",
      description: `Besøg ${municipalityName} mindst 3 gange.`,
      completed: visitCount >= 3,
      progressText: `${Math.min(visitCount, 3)} / 3 besøg`,
    },
    {
      id: "local-presence",
      title: "Lokal tilstedeværelse",
      description: `Besøg ${municipalityName} mindst 5 gange.`,
      completed: visitCount >= 5,
      progressText: `${Math.min(visitCount, 5)} / 5 besøg`,
    },
    {
      id: "major-city",
      title: "Storby-opdagelse",
      description: `${municipalityName} er markeret som en vigtig byzone.`,
      completed: Boolean(metadata.isMajor && visitCount >= 1),
      progressText: metadata.isMajor
        ? visitCount >= 1
          ? "Fuldført"
          : "0 / 1 besøg"
        : "Ikke relevant",
    },
  ];
}