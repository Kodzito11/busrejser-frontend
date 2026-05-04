import { http } from "../../../shared/api/http";
import type { ProgressionMapResponse } from "../model/progression.types";

export const progressionApi = {
  getMap: () => http<ProgressionMapResponse>("/api/Progression/map"),
};