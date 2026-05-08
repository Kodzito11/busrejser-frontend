export type GeoPlace = {
  geoNameId: number;
  name: string;
  asciiName?: string | null;
  countryCode: string;
  admin1Code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  population: number;
  featureClass?: string | null;
  featureCode?: string | null;
};