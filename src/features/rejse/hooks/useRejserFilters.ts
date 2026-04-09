import { useMemo, useState } from "react";

import type { Rejse } from "../model/rejse.types";
import {
  filterAndSortRejser,
  getAvailableDestinations,
  type SortOption,
} from "../utils/publicRejseFilters";

type Options = {
  initialSort?: SortOption;
};

export function useRejserFilters(
  rejser: Rejse[],
  availableSeats: Record<number, number>,
  options: Options = {}
) {
  const defaultSort = options.initialSort ?? "date-asc";

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>(defaultSort);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const destinations = useMemo(() => getAvailableDestinations(rejser), [rejser]);

  const visibleRejser = useMemo(
    () =>
      filterAndSortRejser(
        rejser,
        {
          search,
          sort,
          onlyAvailable,
          selectedDestination,
          onlyFeatured,
        },
        availableSeats
      ),
    [
      availableSeats,
      onlyAvailable,
      onlyFeatured,
      rejser,
      search,
      selectedDestination,
      sort,
    ]
  );

  const hasActiveFilters =
    search.trim().length > 0 ||
    onlyAvailable ||
    onlyFeatured ||
    selectedDestination.length > 0 ||
    sort !== defaultSort;

  function resetFilters() {
    setSearch("");
    setSort(defaultSort);
    setOnlyAvailable(false);
    setSelectedDestination("");
    setOnlyFeatured(false);
  }

  return {
    search,
    setSearch,
    sort,
    setSort,
    onlyAvailable,
    setOnlyAvailable,
    selectedDestination,
    setSelectedDestination,
    onlyFeatured,
    setOnlyFeatured,
    destinations,
    visibleRejser,
    hasActiveFilters,
    resetFilters,
  };
}
