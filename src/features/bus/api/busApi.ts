import { http } from "../../../shared/api/http";
import type { Facilitet } from "../model/facilitet.types";
import type { Bus, BusCreate } from "../model/bus.types";

export const busApi = {
  list: () => http<Bus[]>("/api/bus"),
  get: (id: number) => http<Bus>(`/api/bus/${id}`),
  create: (payload: BusCreate) =>
    http<number>("/api/bus", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: BusCreate) =>
    http<void>(`/api/bus/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id: number) => http<void>(`/api/bus/${id}`, { method: "DELETE" }),

  faciliteter: (id: number) =>
    http<Facilitet[]>(`/api/bus/${id}/faciliteter`),

  addFacilitet: (busId: number, facilitetId: number) =>
    http<void>(`/api/bus/${busId}/faciliteter/${facilitetId}`, {
      method: "POST",
    }),

  removeFacilitet: (busId: number, facilitetId: number) =>
    http<void>(`/api/bus/${busId}/faciliteter/${facilitetId}`, {
      method: "DELETE",
    }),

  uploadImage: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return http(`/api/bus/${id}/image`, {
      method: "POST",
      body: formData,
    });
  },
};
