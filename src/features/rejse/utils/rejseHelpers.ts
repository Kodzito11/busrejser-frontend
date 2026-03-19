import type { Rejse, RejseCreate } from "../model/rejse.types";

export const emptyForm: RejseCreate = {
  title: "",
  destination: "",
  startAt: "",
  endAt: "",
  price: 0,
  maxSeats: 0,
  busId: 0,
};

export function getFillPercent(r: Rejse) {
  const booked = r.bookedSeats ?? 0;
  if (!r.maxSeats) return 0;

  return Math.min(100, Math.round((booked / r.maxSeats) * 100));
}

export function toInputDateTime(value: string) {
  if (!value) return "";

  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleString("da-DK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCreatedAt(value: string) {
  return new Date(value).toLocaleString("da-DK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatus(rejse: Rejse) {
  const now = new Date();
  const start = new Date(rejse.startAt);
  const end = new Date(rejse.endAt);

  if (end < now) return "Afsluttet";
  if (start <= now && end >= now) return "I gang";
  return "Kommende";
}

export function getStatusClassName(rejse: Rejse) {
  const status = getStatus(rejse);

  if (status === "Kommende") return "kommende";
  if (status === "I gang") return "igang";
  return "afsluttet";
}