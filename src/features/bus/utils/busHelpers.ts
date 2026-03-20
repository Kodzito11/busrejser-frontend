import type { BusForm } from "../model/bus.types";

export const emptyBusForm: BusForm = {
  registreringnummer: "",
  model: "",
  busselskab: "",
  status: 0,
  type: 0,
  kapasitet: 1,
};

export function getBusStatusLabel(status: number) {
  return ["Aktiv", "Inaktiv", "Vedligeholdelse"][status] ?? `(${status})`;
}

export function getBusTypeLabel(type: number) {
  return ["StorTurBus", "MiniBus", "VIPBus", "Shuttle", "Andet"][type] ?? `(${type})`;
}