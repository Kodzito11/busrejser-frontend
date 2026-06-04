import type { Rejse } from "../../model/rejse.types";

type Props = {
  rejse: Rejse;
  seatsLeft: number;
  onClick: () => void;
};

export default function RejseCard({ rejse, seatsLeft, onClick }: Props) {
  const isSoldOut = seatsLeft <= 0;

  function formatDate(value: string) {
    return new Date(value).toLocaleDateString("da-DK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatPrice(value: number) {
    return `${value.toLocaleString("da-DK")} kr`;
  }

  return (
    <article className="trip-card publicTripCard">
      <div
        className={`publicTripCard__image ${
          !rejse.imageUrl ? "publicTripCard__image--empty" : ""
        }`}
        style={
          rejse.imageUrl ? { backgroundImage: `url(${rejse.imageUrl})` } : undefined
        }
      >
        <div className={`publicTripCard__badge ${isSoldOut ? "isSoldOut" : ""}`}>
          {isSoldOut ? "Udsolgt" : `${seatsLeft} ledige`}
        </div>
      </div>

      <div className="publicTripCard__content">
        <div className="publicTripCard__top">
          <h3>{rejse.title}</h3>
          <p className="publicTripCard__destination">{rejse.destination}</p>
        </div>

        {rejse.shortDescription && (
          <p className="publicTripCard__description">{rejse.shortDescription}</p>
        )}

        <div className="publicTripCard__meta">
          <div>
            <span>Afgang</span>
            <strong>{formatDate(rejse.startAt)}</strong>
          </div>

          <div>
            <span>Hjemkomst</span>
            <strong>{formatDate(rejse.endAt)}</strong>
          </div>

          <div>
            <span>Fra</span>
            <strong>{formatPrice(rejse.price)}</strong>
          </div>
        </div>

        <div className="publicTripCard__actions">
          <button onClick={onClick} disabled={isSoldOut}>
            {isSoldOut ? "Udsolgt" : "Se rejse"}
          </button>
        </div>
      </div>
    </article>
  );
}
