import { http } from "../../../shared/api/http";
import type {
  AddProgressionTerritoryAliasRequest,
  CreateProgressionTerritoryRequest,
  ProgressionTerritoryAdminItem,
  UpdateProgressionTerritoryRequest,
} from "../model/progressionTerritoryAdmin.types";

const basePath = "/api/admin/progression/territories";

export const progressionTerritoryAdminApi = {
  getAll: () => http<ProgressionTerritoryAdminItem[]>(basePath),

  getById: (id: number) =>
    http<ProgressionTerritoryAdminItem>(`${basePath}/${id}`),

  create: (payload: CreateProgressionTerritoryRequest) =>
    http<{ id: number }>(basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: UpdateProgressionTerritoryRequest) =>
    http<void>(`${basePath}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  addAlias: (territoryId: number, payload: AddProgressionTerritoryAliasRequest) =>
    http<void>(`${basePath}/${territoryId}/aliases`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  removeAlias: (aliasId: number) =>
    http<void>(`${basePath}/aliases/${aliasId}`, {
      method: "DELETE",
    }),
};