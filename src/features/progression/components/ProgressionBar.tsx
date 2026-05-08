type Props = {
  label: string;
  percent: number;
  active?: boolean;
  onClick?: () => void;
};

export default function ProgressionBar({ label, percent, active, onClick }: Props) {
  return (
    <button
      type="button"
      className={`progression-bar-card ${active ? "progression-bar-card--active" : ""}`}
      onClick={onClick}
    >
      <div className="progression-bar-card__top">
        <strong>{label}</strong>
        <span>{percent}%</span>
      </div>

      <div className="progression-bar-card__track">
        <div
          className="progression-bar-card__fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </button>
  );
}