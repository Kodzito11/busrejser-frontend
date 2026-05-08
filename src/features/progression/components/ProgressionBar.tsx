type Props = {
  label: string;
  percent: number;
  active?: boolean;
  locked?: boolean;
  onClick?: () => void;
};

export default function ProgressionBar({
  label,
  percent,
  active,
  locked,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      className={`
        progression-bar-card
        ${active ? "progression-bar-card--active" : ""}
        ${locked ? "progression-bar-card--locked" : ""}
      `}
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