import { BookingStatus, type Booking } from "../model/booking.types";

type Props = {
  status: Booking["status"];
};

export default function BookingStatusBadge({ status }: Props) {
  const isCancelled = status === BookingStatus.Cancelled;

  return (
    <span className={`miniStatus ${isCancelled ? "cancelled" : "active"}`}>
      {isCancelled ? "Annulleret" : "Aktiv"}
    </span>
  );
}