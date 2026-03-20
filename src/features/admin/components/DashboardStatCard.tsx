type DashboardStatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  onClick?: () => void;
};

export default function DashboardStatCard({
  title,
  value,
  subtitle,
  onClick,
}: DashboardStatCardProps) {
  return (
    <button
      type="button"
      className="card statCard statCardButton"
      onClick={onClick}
    >
      <p className="muted">{title}</p>
      <h2>{value}</h2>
      {subtitle && <p className="muted">{subtitle}</p>}
    </button>
  );
}