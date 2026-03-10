export const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  }

  // nogle endpoints kan returnere tomt body
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return undefined as T;

  return (await res.json()) as T;
}

export type Bus = {
  busId: number;
  registreringnummer: string;
  model: string;
  busselskab: string;
  status: number;
  type: number;
  kapasitet: number;
};

export type BusCreate = Omit<Bus, "busId">;

export type Facilitet = {
  // din model har private set Id, så API kan evt. mangle id i første version
  id?: number;
  name: string;
  description: string;
  extraPrice: number;
  isActive: boolean;
  type: number;
};

export type Rejse = {
  rejseId: number;
  title: string;
  destination: string;
  startAt: string;
  endAt: string;
  price: number;
  maxSeats: number;
  busId?: number | null;
};

export type RejseCreate = Omit<Rejse, "rejseId">;

export const api = {
  buses: {
    list: () => http<Bus[]>("/api/bus"),
    get: (id: number) => http<Bus>(`/api/bus/${id}`),
    create: (payload: BusCreate) =>
      http<number>("/api/bus", { method: "POST", body: JSON.stringify(payload) }),
    delete: (id: number) => http<void>(`/api/bus/${id}`, { method: "DELETE" }),
    faciliteter: (id: number) => http<Facilitet[]>(`/api/bus/${id}/faciliteter`),
    addFacilitet: (busId: number, facilitetId: number) =>
      http<void>(`/api/bus/${busId}/faciliteter/${facilitetId}`, { method: "POST" }),
    removeFacilitet: (busId: number, facilitetId: number) =>
      http<void>(`/api/bus/${busId}/faciliteter/${facilitetId}`, { method: "DELETE" }),
  },
  faciliteter: {
    list: () => http<Facilitet[]>("/api/facilitet"),
    create: (payload: Omit<Facilitet, "id">) =>
      http<number>("/api/facilitet", { method: "POST", body: JSON.stringify(payload) }),
    delete: (id: number) => http<void>(`/api/facilitet/${id}`, { method: "DELETE" }),
  },

  rejser: {
    list: () => http<Rejse[]>("/api/rejse"),
    get: (id: number) => http<Rejse>(`/api/rejse/${id}`),
    create: (payload: RejseCreate) =>
      http<number>("/api/rejse", { method: "POST", body: JSON.stringify(payload) }),
    delete: (id: number) => http<void>(`/api/rejse/${id}`, { method: "DELETE" }),
  },
};