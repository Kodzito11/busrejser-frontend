import { http } from "../../../shared/api/http";
import type { GeoPlace } from "../types/geo";

export function searchGeoPlaces(q: string): Promise<GeoPlace[]> {
  return http<GeoPlace[]>(`/api/geo/search?q=${encodeURIComponent(q)}`);
}