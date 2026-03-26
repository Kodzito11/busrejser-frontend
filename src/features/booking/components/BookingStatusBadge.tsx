import { BookingStatus, type BookingStatusType } from "../model/booking.types";

type Props = {
  status: BookingStatusType;
};

export default function BookingStatusBadge({ status }: Props) {
  const isCancelled = status === BookingStatus.Cancelled;
  const isPaid = status === BookingStatus.Paid;
  const isPending = status === BookingStatus.Pending;
  const isFailed = status === BookingStatus.PaymentFailed;

  let label = "Ukendt";
  let className = "miniStatus";

  if (isPaid) {
    label = "Betalt";
    className += " active";
  } else if (isCancelled) {
    label = "Annulleret";
    className += " cancelled";
  } else if (isPending) {
    label = "Afventer";
    className += " pending";
  } else if (isFailed) {
    label = "Betaling fejlet";
    className += " failed";
  }

  return <span className={className}>{label}</span>;
}