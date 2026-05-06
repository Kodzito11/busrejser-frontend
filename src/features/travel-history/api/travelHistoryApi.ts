import { http } from "../../../shared/api/http";
import type { TravelHistoryItem } from "../model/travelHistory.types";

export const travelHistoryApi = {
  getMine: () => http<TravelHistoryItem[]>("/api/TravelHistory/mine"),
};
