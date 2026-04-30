import type { Bus } from "../model/bus.types";

type Props = {
  buses: Bus[];
  loading: boolean;
  canEdit: boolean;
  canDelete: boolean;
  deletingId: number | null;
  onEdit: (bus: Bus) => void;
  onDelete: (id: number) => void;
  onOpenImage: (imageUrl: string) => void;
};

export default function AdminBusTable({
  buses,
  loading,
  canEdit,
  canDelete,
  deletingId,
  onEdit,
  onDelete,
  onOpenImage,
}: Props) {
  if (loading && buses.length === 0) {
    return <p className="muted">Loader busser...</p>;
  }

  if (buses.length === 0) {
    return <p className="muted">Ingen busser fundet.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Billede</th>
            <th>Registrering</th>
            <th>Model</th>
            <th>Selskab</th>
            <th>Kapacitet</th>
            <th>Status</th>
            <th>Type</th>
            {(canEdit || canDelete) && <th>Handlinger</th>}
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.busId}>
              <td>{bus.busId}</td>

              <td>
                {bus.imageUrl ? (
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => onOpenImage(bus.imageUrl!)}
                  >
                    Se billede
                  </button>
                ) : (
                  <span className="muted">-</span>
                )}
              </td>

              <td>{bus.registreringnummer}</td>
              <td>{bus.model}</td>
              <td>{bus.busselskab}</td>
              <td>{bus.kapasitet}</td>
              <td>{bus.status}</td>
              <td>{bus.type}</td>

              {(canEdit || canDelete) && (
                <td>
                  <div className="row">
                    {canEdit && (
                      <button
                        type="button"
                        className="btn ghost"
                        onClick={() => onEdit(bus)}
                      >
                        Rediger
                      </button>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        className="danger"
                        onClick={() => onDelete(bus.busId)}
                        disabled={deletingId === bus.busId}
                      >
                        {deletingId === bus.busId ? "Sletter..." : "Slet"}
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
