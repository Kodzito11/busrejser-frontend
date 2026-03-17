import { http } from "../../../shared/api/http";
import type { Rejse, RejseCreate } from "../model/rejse.types";

export const rejseApi = {
  list: () => http<Rejse[]>("/api/rejse"),
  get: (id: number) => http<Rejse>(`/api/rejse/${id}`),
  create: (payload: RejseCreate) =>
    http<number>("/api/rejse", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  delete: (id: number) => http<void>(`/api/rejse/${id}`, { method: "DELETE" }),
};