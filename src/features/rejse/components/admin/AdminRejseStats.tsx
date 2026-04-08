import type { Rejse } from "../../model/rejse.types";

type Props = {
  rejser: Rejse[];
};

function isUpcoming(rejse: Rejse) {
  return new Date(rejse.startAt).getTime() > Date.now();
}

function isSoldOut(rejse: Rejse) {
  return (rejse.maxSeats ?? 0) > 0 && (rejse.bookedSeats ?? 0) >= rejse.maxSeats;
}

export default function AdminRejseStats({ rejser }: Props) {
  const upcoming = rejser.filter(isUpcoming).length;
  const soldOut = rejser.filter(isSoldOut).length;
  const published = rejser.filter((r) => r.isPublished).length;

  const avgPrice =
    rejser.length > 0
      ? Math.round(
          rejser.reduce((sum, rejse) => sum + Number(rejse.price || 0), 0) /
            rejser.length
        )
      : 0;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        marginBottom: 20,
      }}
    >
      <div className="card">
        <p className="muted">Alle rejser</p>
        <h2 style={{ margin: 0 }}>{rejser.length}</h2>
      </div>

      <div className="card">
        <p className="muted">Kommende</p>
        <h2 style={{ margin: 0 }}>{upcoming}</h2>
      </div>

      <div className="card">
        <p className="muted">Publicerede</p>
        <h2 style={{ margin: 0 }}>{published}</h2>
      </div>

      <div className="card">
        <p className="muted">Udsolgte</p>
        <h2 style={{ margin: 0 }}>{soldOut}</h2>
      </div>

      <div className="card">
        <p className="muted">Gns. pris</p>
        <h2 style={{ margin: 0 }}>{avgPrice.toLocaleString("da-DK")} kr.</h2>
      </div>
    </div>
  );
}