import { API_BASE, http } from "../../../shared/api/http";
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
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/bus/${id}/image`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      let message = "Upload fejlede.";

      try {
        const data = await res.json();
        if (data?.message || data?.Message) {
          message = data.message ?? data.Message;
        }
      } catch {
        const text = await res.text().catch(() => "");
        if (text) message = text;
      }

      throw new Error(message);
    }

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return null;

    return await res.json();
  },
};