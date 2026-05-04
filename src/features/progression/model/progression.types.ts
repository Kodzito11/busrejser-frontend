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

export type ProgressionMapResponse = {
  visitedLocationCount: number;
  visitedCountryCount: number;
  locations: VisitedLocationMapItem[];
};