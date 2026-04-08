import type { Rejse } from "../../model/rejse.types";
import RejseCard from "./RejseCard";

type Props = {
  rejser: Rejse[];
  availableSeats: Record<number, number>;
  loading: boolean;
  onOpen: (id: number) => void;
};

export default function RejseCardList({
  rejser,
  availableSeats,
  loading,
  onOpen,
}: Props) {
  if (loading && rejser.length === 0) {
    return <p className="muted">Loader rejser...</p>;
  }

  if (rejser.length === 0) {
    return (
      <p className="muted">
        Ingen rejser matcher din søgning eller filter.
      </p>
    );
  }

  return (
    <div className="trip-cards">
      {rejser.map((r) => {
        const seatsLeft = availableSeats[r.rejseId] ?? r.maxSeats;

        return (
          <RejseCard
            key={r.rejseId}
            rejse={r}
            seatsLeft={seatsLeft}
            onClick={() => onOpen(r.rejseId)}
          />
        );
      })}
    </div>
  );
}