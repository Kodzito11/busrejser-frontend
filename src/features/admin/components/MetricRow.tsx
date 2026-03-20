type MetricRowProps = {
  label: string;
  value: string;
  sublabel?: string;
};

export default function MetricRow({
  label,
  value,
  sublabel,
}: MetricRowProps) {
  return (
    <div className="dashboardMetricRow">
      <div>
        <strong>{label}</strong>
        {sublabel && <p className="muted">{sublabel}</p>}
      </div>
      <span className="dashboardMetricValue">{value}</span>
    </div>
  );
}