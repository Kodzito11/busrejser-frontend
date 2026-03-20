import type { ChartBarItem } from "../utils/adminDashboardChartHelpers";

type DashboardMiniBarChartProps = {
  title?: string;
  items: ChartBarItem[];
  valueFormatter?: (value: number) => string;
  onItemClick?: (item: ChartBarItem) => void;
};

export default function DashboardMiniBarChart({
  title,
  items,
  valueFormatter = (value) => String(value),
  onItemClick,
}: DashboardMiniBarChartProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="dashboardChart">
      {title && <h3>{title}</h3>}

      <div className="dashboardChartList">
        {items.map((item) => {
          const width = `${Math.max(
            8,
            Math.round((item.value / maxValue) * 100)
          )}%`;

          const clickable = !!onItemClick && !!item.tripId;

          return (
            <button
              key={`${item.label}-${item.value}`}
              type="button"
              className={`dashboardChartRow ${clickable ? "clickable" : ""}`}
              onClick={() => clickable && onItemClick(item)}
              disabled={!clickable}
            >
              <div className="dashboardChartLabel">
                <strong>{item.label}</strong>
                {item.subtitle && <p className="muted">{item.subtitle}</p>}
              </div>

              <div className="dashboardChartBarWrap">
                <div className="dashboardChartBar">
                  <div
                    className={`dashboardChartBarFill ${item.tone ?? "default"}`}
                    style={{ width }}
                  />
                </div>
              </div>

              <div className="dashboardChartValue">
                {valueFormatter(item.value)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}