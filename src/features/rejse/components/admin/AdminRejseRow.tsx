import { Fragment } from "react";

import type { Rejse } from "../../model/rejse.types";
import type { BookingListItem } from "../../../booking/model/booking.types";
import { BookingStatus } from "../../../booking/model/booking.types";

import { formatDate } from "../../utils/rejseHelpers";
import CapacityCell from "../CapasityCell";
import RejseStatusBadge from "../RejseStatusBadge";
import AdminBookingTable from "../../../booking/components/AdminBookingTable";

type Props = {
    rejse: Rejse;
    bookings: BookingListItem[];
    isExpanded: boolean;
    isLoadingBookings: boolean;
    deletingId: number | null;
    busyBookingId: number | null;
    highlightRejseId?: number;
    getBusLabel: (busId?: number | null) => string;
    onEdit: (rejse: Rejse) => void;
    onDelete: (rejseId: number) => void;
    onToggleBookings: (rejseId: number) => void;
    onCancelBooking: (bookingId: number, rejseId: number) => void;
    onReactivateBooking: (bookingId: number, rejseId: number) => void;
};

export default function AdminRejseRow({
    rejse,
    bookings,
    isExpanded,
    isLoadingBookings,
    deletingId,
    busyBookingId,
    highlightRejseId,
    getBusLabel,
    onEdit,
    onDelete,
    onToggleBookings,
    onCancelBooking,
    onReactivateBooking,
}: Props) {
    return (
        <Fragment>
            <tr
                id={`rejse-row-${rejse.rejseId}`}
                className={highlightRejseId === rejse.rejseId ? "dashboardJumpRow" : ""}
            >
                <td>#{rejse.rejseId}</td>
                <td>{rejse.title}</td>
                <td>{rejse.destination}</td>
                <td>
                    <RejseStatusBadge rejse={rejse} />
                </td>
                <td>{formatDate(rejse.startAt)}</td>
                <td>{formatDate(rejse.endAt)}</td>
                <td>{rejse.price.toLocaleString("da-DK")} kr.</td>
                <td>
                    <CapacityCell rejse={rejse} />
                </td>
                <td>{getBusLabel(rejse.busId)}</td>
                <td>
                    <div className="actionCell">
                        <button
                            className="btn ghost"
                            type="button"
                            onClick={() => onToggleBookings(rejse.rejseId)}
                        >
                            {isExpanded ? "Skjul bookinger" : "Vis bookinger"}
                        </button>

                        <button
                            className="btn"
                            type="button"
                            onClick={() => onEdit(rejse)}
                        >
                            Redigér
                        </button>

                        <button
                            className="btn danger"
                            type="button"
                            disabled={
                                deletingId === rejse.rejseId || (rejse.bookedSeats ?? 0) > 0
                            }
                            onClick={() => onDelete(rejse.rejseId)}
                            title={
                                (rejse.bookedSeats ?? 0) > 0
                                    ? "Rejsen kan ikke slettes, fordi der er bookinger."
                                    : ""
                            }
                        >
                            {(rejse.bookedSeats ?? 0) > 0
                                ? "Har bookinger"
                                : deletingId === rejse.rejseId
                                    ? "Sletter..."
                                    : "Slet"}
                        </button>
                    </div>
                </td>
            </tr>

            {isExpanded && (
                <tr className="bookingExpandRow">
                    <td colSpan={10}>
                        <div className="bookingExpandBox">
                            <h4>
                                Bookinger for rejse #{rejse.rejseId} · Total: {bookings.length}
                            </h4>

                            <p className="muted">
                                Aktive:{" "}
                                {bookings.filter((b) => b.status !== BookingStatus.Cancelled).length}
                                {" · "}
                                Annullerede:{" "}
                                {bookings.filter((b) => b.status === BookingStatus.Cancelled).length}
                            </p>

                            <AdminBookingTable
                                bookings={bookings}
                                loading={isLoadingBookings}
                                emptyMessage="Ingen bookinger endnu."
                                actionLoadingId={busyBookingId}
                                onCancel={(bookingId) => onCancelBooking(bookingId, rejse.rejseId)}
                                onReactivate={(bookingId) =>
                                    onReactivateBooking(bookingId, rejse.rejseId)
                                }
                            />
                        </div>
                    </td>
                </tr>
            )}
        </Fragment>
    );
}