import type { Rejse } from "../model/rejse.types";
import { getFillPercent } from "../utils/rejseHelpers";

type Props = {
  rejse: Rejse;
};

export default function CapacityCell({ rejse }: Props) {
  const percent = getFillPercent(rejse);
  const booked = rejse.bookedSeats ?? 0;

  function getColor() {
    if (percent > 90) return "#ef4444"; // rød
    if (percent > 60) return "#f59e0b"; // orange
    return "#3b82f6"; // blå
  }

  return (
    <div className="capacity">
      <div className="capacity-bar">
        <div
          className="capacity-fill"
          style={{
            width: `${percent}%`,
            background: getColor(),
          }}
        />
      </div>

      <span className="capacity-text">
        {booked} / {rejse.maxSeats}
      </span>
    </div>
  );
}