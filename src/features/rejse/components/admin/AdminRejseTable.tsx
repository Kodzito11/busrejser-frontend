import type { Rejse } from "../../model/rejse.types";
import type { BookingListItem } from "../../../booking/model/booking.types";
import type { RejseSortBy } from "../../model/adminRejse.types";

import AdminRejseFilters from "./AdminRejseFilters";
import AdminRejseRow from "./AdminRejseRow";

type Props = {
  rejser: Rejse[];
  search: string;
  sortBy: RejseSortBy;
  loading: boolean;
  deletingId: number | null;
  expandedRejseId: number | null;
  bookingsByRejse: Record<number, BookingListItem[]>;
  busyBookingId: number | null;
  loadingBookingsFor: number | null;
  highlightRejseId?: number;
  getBusLabel: (busId?: number | null) => string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: RejseSortBy) => void;
  onEdit: (rejse: Rejse) => void;
  onDelete: (rejseId: number) => void;
  onToggleBookings: (rejseId: number) => void;
  onCancelBooking: (bookingId: number, rejseId: number) => void;
  onReactivateBooking: (bookingId: number, rejseId: number) => void;
};

export default function AdminRejseTable({
  rejser,
  search,
  sortBy,
  loading,
  deletingId,
  expandedRejseId,
  bookingsByRejse,
  busyBookingId,
  loadingBookingsFor,
  highlightRejseId,
  getBusLabel,
  onSearchChange,
  onSortChange,
  onEdit,
  onDelete,
  onToggleBookings,
  onCancelBooking,
  onReactivateBooking,
}: Props) {
  return (
    <>
      <div className="section-header">
        <div>
          <h2>Rejser ({rejser.length})</h2>
          <p className="muted">Søg, sorter og klik for at se bookinger.</p>
        </div>

        <AdminRejseFilters
          search={search}
          sortBy={sortBy}
          onSearchChange={onSearchChange}
          onSortChange={onSortChange}
        />
      </div>

      {loading ? (
        <p className="muted">Loader rejser...</p>
      ) : rejser.length === 0 ? (
        <p className="muted">Ingen rejser fundet.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titel</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Start</th>
                <th>Slut</th>
                <th>Pris</th>
                <th>Belægning</th>
                <th>Bus</th>
                <th>Handling</th>
              </tr>
            </thead>

            <tbody>
              {rejser.map((rejse) => (
                <AdminRejseRow
                  key={rejse.rejseId}
                  rejse={rejse}
                  bookings={bookingsByRejse[rejse.rejseId] ?? []}
                  isExpanded={expandedRejseId === rejse.rejseId}
                  isLoadingBookings={loadingBookingsFor === rejse.rejseId}
                  deletingId={deletingId}
                  busyBookingId={busyBookingId}
                  highlightRejseId={highlightRejseId}
                  getBusLabel={getBusLabel}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleBookings={onToggleBookings}
                  onCancelBooking={onCancelBooking}
                  onReactivateBooking={onReactivateBooking}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}