import type { Rejse } from "../../model/rejse.types";

type Props = {
  rejse: Rejse;
  seatsLeft: number;
  onClick: () => void;
};

export default function RejseCard({ rejse, seatsLeft, onClick }: Props) {
  return (
    <article className="trip-card">
      {rejse.imageUrl && (
        <div
          style={{
            height: "150px",
            backgroundImage: `url(${rejse.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "12px 12px 0 0",
            marginBottom: "1rem",
          }}
        />
      )}

      <div className="trip-card-top">
        <div>
          <p className="trip-card-id">Rejse #{rejse.rejseId}</p>
          <h3>{rejse.title}</h3>
          <p className="muted">{rejse.destination}</p>
          {rejse.shortDescription && <p>{rejse.shortDescription}</p>}
        </div>

        <div className={`trip-badge ${seatsLeft <= 0 ? "soldout" : ""}`}>
          {seatsLeft <= 0 ? "Udsolgt" : `${seatsLeft} ledige`}
        </div>
      </div>

      <div className="trip-meta">
        <div>
          <span className="muted">Start</span>
          <strong>{new Date(rejse.startAt).toLocaleString()}</strong>
        </div>

        <div>
          <span className="muted">Slut</span>
          <strong>{new Date(rejse.endAt).toLocaleString()}</strong>
        </div>

        <div>
          <span className="muted">Pris</span>
          <strong>{rejse.price} kr</strong>
        </div>

        <div>
          <span className="muted">Bus</span>
          <strong>{rejse.busId ?? "-"}</strong>
        </div>
      </div>

      <div className="trip-actions">
        <button onClick={onClick} disabled={seatsLeft <= 0}>
          {seatsLeft <= 0 ? "Udsolgt" : "Se detaljer"}
        </button>
      </div>
    </article>
  );
}