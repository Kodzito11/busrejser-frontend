

// export const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

// function getToken() {
//   return localStorage.getItem("token");
// }

// async function http<T>(path: string, options?: RequestInit): Promise<T> {
//   const token = getToken();

//   const res = await fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(options?.headers || {}),
//     },
//   });

//   if (!res.ok) {
//     let message = `${res.status} ${res.statusText}`;

//     try {
//       const data = await res.json();
//       if (data?.message || data?.Message) {
//         message = data.message ?? data.Message;
//       }

//     } catch {
//       const text = await res.text().catch(() => "");
//       if (text) {
//         message = text;
//       }
//     }

//     throw new Error(message);
//   }

//   const ct = res.headers.get("content-type") || "";
//   if (!ct.includes("application/json")) return undefined as T;

//   return (await res.json()) as T;
// }

// export type RegisterRequest = {
//   username: string;
//   email: string;
//   password: string;
// };

// export type RegisterResponse = {
//   message: string;
//   userId: number;
// };

// export type LoginRequest = {
//   email: string;
//   password: string;
// };

// export type LoginResponse = {
//   token: string;
// };

// export type MeResponse = {
//   userId: string;
//   username: string;
//   email: string;
//   role: string;
// };

// export type Bus = {
//   busId: number;
//   registreringnummer: string;
//   model: string;
//   busselskab: string;
//   status: number;
//   type: number;
//   kapasitet: number;
//   imageUrl?: string | null;
// };

// export type BusCreate = Omit<Bus, "busId">;

// export type Facilitet = {
//   id?: number;
//   name: string;
//   description: string;
//   extraPrice: number;
//   isActive: boolean;
//   type: number;
// };

// export type Rejse = {
//   rejseId: number;
//   title: string;
//   destination: string;
//   startAt: string;
//   endAt: string;
//   price: number;
//   maxSeats: number;
//   busId?: number | null;
// };

// export type Booking = {
//   bookingId: number;
//   rejseId: number;
//   bookingReference: string;
//   kundeNavn: string;
//   kundeEmail: string;
//   antalPladser: number;
//   status: number;
//   createdAt: string;
// };

// export type BookingCreate = {
//   rejseId: number;
//   kundeNavn: string;
//   kundeEmail: string;
//   antalPladser: number;
// };

// export type BookingCreateResponse = {
//   bookingId: number;
//   bookingReference: string;
// };

// export type RejseCreate = Omit<Rejse, "rejseId">;

// export const api = {
//   auth: {
//     register: (payload: RegisterRequest) =>
//       http<RegisterResponse>("/api/auth/register", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       }),

//     login: (payload: LoginRequest) =>
//       http<LoginResponse>("/api/auth/login", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       }),

//     me: () => http<MeResponse>("/api/user/me"),
//   },

//   buses: {
//     list: () => http<Bus[]>("/api/bus"),
//     get: (id: number) => http<Bus>(`/api/bus/${id}`),
//     create: (payload: BusCreate) =>
//       http<number>("/api/bus", { method: "POST", body: JSON.stringify(payload) }),
//     delete: (id: number) => http<void>(`/api/bus/${id}`, { method: "DELETE" }),
//     faciliteter: (id: number) => http<Facilitet[]>(`/api/bus/${id}/faciliteter`),
//     addFacilitet: (busId: number, facilitetId: number) =>
//       http<void>(`/api/bus/${busId}/faciliteter/${facilitetId}`, { method: "POST" }),
//     removeFacilitet: (busId: number, facilitetId: number) =>
//       http<void>(`/api/bus/${busId}/faciliteter/${facilitetId}`, { method: "DELETE" }),
    
//     uploadImage: async (id: number, file: File) => {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await fetch(`${API_BASE}/api/bus/${id}/image`, {
//         method: "POST",
//         headers: {
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: formData,
//       });

//       if (!res.ok) {
//         let message = "Upload fejlede.";

//         try {
//           const data = await res.json();
//           if (data?.message || data?.Message) {
//             message = data.message ?? data.Message;
//           }
//         } catch {
//           const text = await res.text().catch(() => "");
//           if (text) message = text;
//         }

//         throw new Error(message);
//       }

//       const ct = res.headers.get("content-type") || "";
//       if (!ct.includes("application/json")) return null;

//       return await res.json();
//     },
//   },

//   faciliteter: {
//     list: () => http<Facilitet[]>("/api/facilitet"),
//     create: (payload: Omit<Facilitet, "id">) =>
//       http<number>("/api/facilitet", { method: "POST", body: JSON.stringify(payload) }),
//     delete: (id: number) => http<void>(`/api/facilitet/${id}`, { method: "DELETE" }),
//   },

//   rejser: {
//     list: () => http<Rejse[]>("/api/rejse"),
//     get: (id: number) => http<Rejse>(`/api/rejse/${id}`),
//     create: (payload: RejseCreate) =>
//       http<number>("/api/rejse", { method: "POST", body: JSON.stringify(payload) }),
//     delete: (id: number) => http<void>(`/api/rejse/${id}`, { method: "DELETE" }),
//   },

//   bookings: {
//     create: (payload: BookingCreate) =>
//       http<BookingCreateResponse>("/api/booking", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       }),

//     get: (id: number) => http<Booking>(`/api/booking/${id}`),

//     listByRejse: (rejseId: number) =>
//       http<Booking[]>(`/api/booking/rejse/${rejseId}`),

//     mine: () => http<Booking[]>("/api/booking/mine"),

//     getAvailableSeats: (rejseId: number) =>
//       http<number>(`/api/booking/rejse/${rejseId}/available-seats`),

//     cancel: (id: number) =>
//       http<void>(`/api/booking/${id}/cancel`, {
//         method: "PUT",
//       }),

//     reactivate: (id: number) =>
//       http<void>(`/api/booking/${id}/reactivate`, {
//         method: "PUT",
//       }),
//   },
// };

// export function logout() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("me");
// }

// export function getCurrentUser(): MeResponse | null {
//   const raw = localStorage.getItem("me");
//   return raw ? JSON.parse(raw) : null;
// }