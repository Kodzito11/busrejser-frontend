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

export type BusCreate = Omit<Bus, "busId">;