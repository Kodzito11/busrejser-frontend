export type Rejse = {
  rejseId: number;
  title: string;
  destination: string;
  country?: string | null;
  city?: string | null;
  region?: string | null;
  municipality?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  startAt: string;
  endAt: string;
  price: number;
  maxSeats: number;
  busId?: number | null;
  bookedSeats?: number;

  progressionTerritoryId?: number | null;
progressionTerritoryName?: string | null;
progressionTerritoryKey?: string | null;

  shortDescription?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
};

export type RejseCreate = {
  title: string;
  destination: string;
  country: string;
  city: string;
  region?: string | null;
  municipality?: string | null;
  latitude?: number | null;
  longitude?: number | null;
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

  progressionTerritoryId?: number | null;
};