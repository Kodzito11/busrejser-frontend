import { http } from "../../../shared/api/http";
import type { Rejse, RejseCreate } from "../model/rejse.types";

export const rejseApi = {
  list: () => http<Rejse[]>("/api/Rejse"),

  get: (id: number) => http<Rejse>(`/api/Rejse/${id}`),

  create: (payload: RejseCreate) =>
    http<number>("/api/Rejse", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    http<void>(`/api/Rejse/${id}`, {
      method: "DELETE",
    }),
};