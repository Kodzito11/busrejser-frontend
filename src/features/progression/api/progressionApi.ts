import { http } from "../../../shared/api/http";
import type {
  ProgressionMapResponse,
  QuestProgressItem,
} from "../model/progression.types";

export const progressionApi = {
  getMap: () => http<ProgressionMapResponse>("/api/Progression/map"),
  getQuests: () => http<QuestProgressItem[]>("/api/Progression/quests"),
};