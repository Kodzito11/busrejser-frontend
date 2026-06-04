import { useMemo, useState } from "react";

import type { Rejse } from "../model/rejse.types";
import {
  filterAndSortRejser,
  getAvailableDestinations,
  type PeriodOption,
  type SortOption,
} from "../utils/publicRejseFilters";

type Options = {
  initialSort?: SortOption;
  initialDestination?: string;
  initialPeriod?: PeriodOption;
  initialPersons?: number;
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
  const [selectedDestination, setSelectedDestination] = useState(
    options.initialDestination ?? ""
  );
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [period, setPeriod] = useState<PeriodOption>(
    options.initialPeriod ?? ""
  );
  const [persons, setPersons] = useState(options.initialPersons ?? 1);

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
          period,
          persons,
        },
        availableSeats
      ),
    [
      availableSeats,
      onlyAvailable,
      onlyFeatured,
      period,
      persons,
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
    period.length > 0 ||
    persons > 1 ||
    sort !== defaultSort;

  function resetFilters() {
    setSearch("");
    setSort(defaultSort);
    setOnlyAvailable(false);
    setSelectedDestination("");
    setOnlyFeatured(false);
    setPeriod("");
    setPersons(1);
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
    period,
    setPeriod,
    persons,
    setPersons,
    destinations,
    visibleRejser,
    hasActiveFilters,
    resetFilters,
  };
}