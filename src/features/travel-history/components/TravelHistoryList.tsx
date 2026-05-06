import type { TravelHistoryItem } from "../model/travelHistory.types";

type Props = {
  items: TravelHistoryItem[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("da-DK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getLocationText(item: TravelHistoryItem) {
  return [item.city, item.region, item.country].filter(Boolean).join(" · ");
}

export default function TravelHistoryList({ items }: Props) {
  if (items.length === 0) {
    return <p className="muted">Ingen gennemførte rejser endnu.</p>;
  }

  return (
    <div className="travel-history-list">
      {items.map((item) => (
        <article key={item.travelHistoryId} className="travel-history-card">
          <div>
            <h3>{item.destination}</h3>
            <p className="muted">{getLocationText(item) || "Ukendt lokation"}</p>
          </div>

          <div className="travel-history-card__meta">
            <span>Gennemført</span>
            <strong>{formatDate(item.completedAt)}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}
