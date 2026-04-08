type SortOption = "date-asc" | "date-desc" | "price-asc" | "price-desc";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  sort: SortOption;
  setSort: (v: SortOption) => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (v: boolean) => void;
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
          Søg
          <input
            type="text"
            placeholder="Søg på titel eller destination"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

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