import { http } from "../../../shared/api/http";
import type { Badge, UserBadge } from "../model/badge.types";

export const badgeApi = {
  getAll: () => http<Badge[]>("/api/Badge"),
  getMine: () => http<UserBadge[]>("/api/Badge/mine"),
  evaluate: () =>
    http<void>("/api/Badge/evaluate", {
      method: "POST",
    }),
};