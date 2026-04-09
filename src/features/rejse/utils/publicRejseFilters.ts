import type { Rejse } from "../model/rejse.types";

export type SortOption = "date-asc" | "date-desc" | "price-asc" | "price-desc";

export type PublicRejseFilters = {
  search: string;
  sort: SortOption;
  onlyAvailable: boolean;
  selectedDestination: string;
  onlyFeatured: boolean;
};

export function getSeatsLeft(
  rejse: Rejse,
  availableSeats: Record<number, number>
) {
  return (
    availableSeats[rejse.rejseId] ??
    Math.max(0, rejse.maxSeats - (rejse.bookedSeats ?? 0))
  );
}

export function getAvailableDestinations(rejser: Rejse[]) {
  return [...new Set(rejser.map((rejse) => rejse.destination).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "da-DK")
  );
}

export function filterAndSortRejser(
  rejser: Rejse[],
  filters: PublicRejseFilters,
  availableSeats: Record<number, number>
) {
  const publishedRejser = rejser.filter((rejse) => rejse.isPublished);

  let result = publishedRejser;

  if (filters.search.trim()) {
    const query = filters.search.trim().toLowerCase();
    result = result.filter(
      (rejse) =>
        rejse.title.toLowerCase().includes(query) ||
        rejse.destination.toLowerCase().includes(query) ||
        (rejse.shortDescription ?? "").toLowerCase().includes(query)
    );
  }

  if (filters.selectedDestination) {
    result = result.filter(
      (rejse) => rejse.destination === filters.selectedDestination
    );
  }

  if (filters.onlyAvailable) {
    result = result.filter((rejse) => getSeatsLeft(rejse, availableSeats) > 0);
  }

  if (filters.onlyFeatured) {
    result = result.filter((rejse) => rejse.isFeatured);
  }

  return [...result].sort((a, b) => {
    switch (filters.sort) {
      case "date-asc":
        return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
      case "date-desc":
        return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });
}

export function groupTripsByDestination(rejser: Rejse[]) {
  const grouped = new Map<string, Rejse[]>();

  for (const rejse of rejser) {
    const current = grouped.get(rejse.destination) ?? [];
    current.push(rejse);
    grouped.set(rejse.destination, current);
  }

  return [...grouped.entries()]
    .map(([destination, trips]) => ({
      destination,
      trips: [...trips].sort((a, b) => a.price - b.price),
      fromPrice: Math.min(...trips.map((trip) => trip.price)),
    }))
    .sort((a, b) => a.fromPrice - b.fromPrice);
}
