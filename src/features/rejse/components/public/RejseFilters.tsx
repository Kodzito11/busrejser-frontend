import type { SortOption } from "../../utils/publicRejseFilters";

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
  onReset,
  hasActiveFilters,
}: Props) {
  return (
    <section className="card">
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          alignItems: "end",
        }}
      >
        <label>
          Soeg
          <input
            type="text"
            placeholder="Søg på titel, destination eller tekst"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        {setSelectedDestination && (
          <label>
            Destination
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

        <label>
          Sortering
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

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            minHeight: "42px",
          }}
        >
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          Kun ledige pladser
        </label>

        {setOnlyFeatured && (
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              minHeight: "42px",
            }}
          >
            <input
              type="checkbox"
              checked={onlyFeatured}
              onChange={(e) => setOnlyFeatured(e.target.checked)}
            />
            Kun featured
          </label>
        )}

        <div>
          <button
            type="button"
            className="ghost"
            onClick={onReset}
            disabled={!hasActiveFilters}
          >
            Nulstil filtre
          </button>
        </div>
      </div>
    </section>
  );
}
