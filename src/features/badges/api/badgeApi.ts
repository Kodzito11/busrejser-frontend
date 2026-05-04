export const badgeApi = {
  all: () => http<Badge[]>("/api/Badge"),
  mine: () => http<UserBadge[]>("/api/Badge/mine"),
  evaluate: () => http<{ message: string }>("/api/Badge/evaluate", {
    method: "POST",
  }),
};