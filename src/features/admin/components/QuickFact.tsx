type QuickFactProps = {
  label: string;
  value: string | number;
};

export default function QuickFact({ label, value }: QuickFactProps) {
  return (
    <div className="dashboardQuickFact">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}