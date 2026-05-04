export type Badge = {
  badgeId: number;
  slug: string;
  name: string;
  description: string;
  iconUrl: string;
  ruleType: string;
  ruleValue?: string | null;
  requiredValue: number;
  ruleWindowValue?: number | null;
  tier: string;
};

export type UserBadge = {
  badgeId: number;
  slug: string;
  name: string;
  description: string;
  iconUrl: string;
  tier: string;
  earnedAt: string;
};