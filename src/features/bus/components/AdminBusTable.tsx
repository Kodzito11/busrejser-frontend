import type { Bus } from "../model/bus.types";
import { API_BASE } from "../../../shared/api/http";
import { getBusTypeLabel } from "../utils/busHelpers";
import BusStatusBadge from "./BusStatusBadge";

type Props = {
  buses: Bus[];
  loading?: boolean;
  canDelete?: boolean;
  onDelete?: (id: number) => void;
  onOpenImage?: (url: string) => void;
};

export default function AdminBusTable({
  buses,
  loading = false,
  canDelete = false,
  onDelete,
  onOpenImage,
}: Props) {
  if (loading && buses.length === 0) {
    return <p className="muted">Loader busser...</p>;
  }

  if (buses.length === 0) {
    return <p className="muted">Ingen busser endnu.</p>;
  }

  return (
    <div className="table">
      <div className="tr head busser">
        <div>ID</div>
        <div>Billede</div>
        <div>Reg</div>
        <div>Model</div>
        <div>Selskab</div>
        <div>Status</div>
        <div>Type</div>
        <div>Kap</div>
        {canDelete && <div></div>}
      </div>

      {buses.map((b) => (
        <div className="tr busser" key={b.busId}>
          <div>{b.busId}</div>

          <div>
            {b.imageUrl ? (
              <img
                src={`${API_BASE}${b.imageUrl}`}
                alt={b.model}
                className="busThumb"
                onClick={() =>
                  onOpenImage?.(`${API_BASE}${b.imageUrl}`)
                }
              />
            ) : (
              <span className="muted">Ingen</span>
            )}
          </div>

          <div>{b.registreringnummer}</div>
          <div>{b.model}</div>
          <div>{b.busselskab}</div>
          <div>{<BusStatusBadge status={b.status} />}</div>
          <div>{getBusTypeLabel(b.type)}</div>
          <div>{b.kapasitet}</div>

          {canDelete && (
            <div className="actions">
              <button
                className="danger"
                onClick={() => onDelete?.(b.busId)}
              >
                Slet
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}