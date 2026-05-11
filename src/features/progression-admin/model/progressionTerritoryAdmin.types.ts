export type ProgressionTerritoryAlias = {
  progressionTerritoryAliasId: number;
  value: string;
};

export type ProgressionTerritoryAdminItem = {
  progressionTerritoryId: number;
  key: string;
  name: string;
  type: string;
  isActive: boolean;
  isVisible: boolean;
  isComingSoon: boolean;
  masteryTarget: number;
  description?: string | null;
  aliases: ProgressionTerritoryAlias[];
};

export type CreateProgressionTerritoryRequest = {
  key: string;
  name: string;
  type: string;
  isActive: boolean;
  isVisible: boolean;
  isComingSoon: boolean;
  masteryTarget: number;
  description?: string | null;
  aliases: string[];
};

export type UpdateProgressionTerritoryRequest = {
  key: string;
  name: string;
  type: string;
  isActive: boolean;
  isVisible: boolean;
  isComingSoon: boolean;
  masteryTarget: number;
  description?: string | null;
};

export type AddProgressionTerritoryAliasRequest = {
  value: string;
};