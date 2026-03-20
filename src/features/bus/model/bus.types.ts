export type Bus = {
  busId: number;
  registreringnummer: string;
  model: string;
  busselskab: string;
  status: number;
  type: number;
  kapasitet: number;
  imageUrl?: string | null;
};

export type BusForm = {
  registreringnummer: string;
  model: string;
  busselskab: string;
  status: number;
  type: number;
  kapasitet: number;
};

export type BusCreate = Omit<Bus, "busId">;