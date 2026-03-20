import type { DashboardActionInsight } from "../utils/adminDashboardChartHelpers";

type DashboardActionInsightsProps = {
  items: DashboardActionInsight[];
  onItemClick?: (item: DashboardActionInsight) => void;
};

export default function DashboardActionInsights({
  items,
  onItemClick,
}: DashboardActionInsightsProps) {
  return (
    <div className="dashboardInsightList">
      {items.map((item, index) => {
        const clickable = Boolean(onItemClick && item.tripId);

        function handleClick() {
          if (clickable && onItemClick) {
            onItemClick(item);
          }
        }

        return (
          <button
            key={`${item.title}-${index}`}
            type="button"
            className={`dashboardInsightCard ${item.type} ${
              clickable ? "clickable" : ""
            }`}
            onClick={handleClick}
            disabled={!clickable}
          >
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            {clickable && item.cta && (
              <span className="dashboardInsightCta">{item.cta} →</span>
            )}
          </button>
        );
      })}
    </div>
  );
}