import type { PeriodOption, SortOption } from "../../utils/publicRejseFilters";
import GeoAutocompleteInput from "../../../geo/components/GeoAutocompleteInput";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  sort: SortOption;
  setSort: (v: SortOption) => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (v: boolean) => void;
  destinations?: string[];
  selectedDestination?: string;
  setSelectedDestination?: (v: string) => void;
  onlyFeatured?: boolean;
  setOnlyFeatured?: (v: boolean) => void;
  period?: PeriodOption;
  setPeriod?: (v: PeriodOption) => void;
  persons?: number;
  setPersons?: (v: number) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
};

export default function RejseFilters({
  search,
  setSearch,
  sort,
  setSort,
  onlyAvailable,
  setOnlyAvailable,
  destinations = [],
  selectedDestination = "",
  setSelectedDestination,
  onlyFeatured = false,
  setOnlyFeatured,
  period = "",
  setPeriod,
  persons = 1,
  setPersons,
  onReset,
  hasActiveFilters,
}: Props) {
  return (
    <section className="rejseFilters">
      <div className="rejseFilters__header">
        <div>
          <p>Filtrering</p>
          <h2>Find den rigtige rejse</h2>
        </div>

        <button
          type="button"
          className="rejseFilters__reset"
          onClick={onReset}
          disabled={!hasActiveFilters}
        >
          Nulstil filtre
        </button>
      </div>

      <div className="rejseFilters__grid">
        <label className="rejseFilters__field rejseFilters__field--wide">
          <span>Søg</span>
          <GeoAutocompleteInput
            value={search}
            placeholder="Søg efter by eller destination"
            onChange={setSearch}
            onSelect={(place) => {
              setSearch(place.name);

              if (setSelectedDestination) {
                setSelectedDestination(place.name);
              }
            }}
          />
        </label>

        {setSelectedDestination && (
          <label className="rejseFilters__field">
            <span>Destination</span>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
            >
              <option value="">Alle destinationer</option>
              {destinations.map((destination) => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
            </select>
          </label>
        )}

        {setPeriod && (
          <label className="rejseFilters__field">
            <span>Periode</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodOption)}
            >
              <option value="">Alle perioder</option>
              <option value="kommende">Kommende</option>
              <option value="sommer">Sommer</option>
              <option value="efteraar">Efterår</option>
              <option value="vinter">Vinter</option>
            </select>
          </label>
        )}

        {setPersons && (
          <label className="rejseFilters__field">
            <span>Personer</span>
            <input
              type="number"
              min={1}
              value={persons}
              onChange={(e) =>
                setPersons(Math.max(1, Number(e.target.value)))
              }
            />
          </label>
        )}

        <label className="rejseFilters__field">
          <span>Sortering</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="date-asc">Tidligste afgang</option>
            <option value="date-desc">Seneste afgang</option>
            <option value="price-asc">Billigste</option>
            <option value="price-desc">Dyreste</option>
          </select>
        </label>
      </div>

      <div className="rejseFilters__toggles">
        <label className="rejseFilters__toggle">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          Kun ledige pladser
        </label>

        {setOnlyFeatured && (
          <label className="rejseFilters__toggle">
            <input
              type="checkbox"
              checked={onlyFeatured}
              onChange={(e) => setOnlyFeatured(e.target.checked)}
            />
            Kun featured
          </label>
        )}
      </div>
    </section>
  );
}
