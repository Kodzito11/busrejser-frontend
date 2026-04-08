import type { RejseSortBy } from "../../model/adminRejse.types";

type Props = {
  search: string;
  sortBy: RejseSortBy;
  onSearchChange: (value: string) => void;
  onSortChange: (value: RejseSortBy) => void;
};

export default function AdminRejseFilters({
  search,
  sortBy,
  onSearchChange,
  onSortChange,
}: Props) {
  return (
    <div className="toolbar">
      <input
        className="input"
        type="text"
        placeholder="Søg på titel, destination eller bus..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        className="input"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as RejseSortBy)}
      >
        <option value="start">Startdato</option>
        <option value="price">Pris</option>
        <option value="fill">Mest fyldt</option>
      </select>
    </div>
  );
}