export type Rejse = {
  rejseId: number;
  title: string;
  destination: string;
  startAt: string;
  endAt: string;
  price: number;
  maxSeats: number;
  busId?: number | null;
  bookedSeats?: number;

  shortDescription?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
};

export type RejseCreate = {
  title: string;
  destination: string;
  startAt: string;
  endAt: string;
  price: number;
  maxSeats: number;
  busId?: number | null;

  shortDescription?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
};