
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

export type RejseCreate = {
  title: string;
  destination: string;
  startAt: string;
  endAt: string;
  price: number;
  maxSeats: number;
  busId: number;
};
