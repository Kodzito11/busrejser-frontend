export type VisitedLocationMapItem = {
  visitedLocationId: number;
  name: string;
  country: string;
  region: string;
  municipality?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  visitCount: number;
  firstVisitedAt: string;
  lastVisitedAt: string;
  hasCoordinates: boolean;
};

export type ProgressionStatus = "locked" | "unlocked" | "mastered";

export type TerritoryProgressItem = {
  key: string;
  name: string;
  type: string;
  visitCount: number;
  status: ProgressionStatus;
  completionPercent: number;
};

export type MunicipalityProgressItem = {
  name: string;
  region: string;
  visitCount: number;
  status: ProgressionStatus;
  completionPercent: number;
};

export type ProgressionMapResponse = {
  visitedLocationCount: number;
  visitedCountryCount: number;
  locations: VisitedLocationMapItem[];
  regions: RegionProgressItem[];
  territories: TerritoryProgressItem[];
  municipalities: MunicipalityProgressItem[];
};

export type RegionProgressItem = {
  country: string;
  region: string;
  visitedLocationCount: number;
  totalVisitCount: number;
  lastVisitedAt: string;
};