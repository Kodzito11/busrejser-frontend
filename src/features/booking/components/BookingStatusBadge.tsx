type Props = {
  isCancelled: boolean;
};

export default function BookingStatusBadge({ isCancelled }: Props) {
  return (
    <span className={`miniStatus ${isCancelled ? "cancelled" : "active"}`}>
      {isCancelled ? "Annulleret" : "Aktiv"}
    </span>
  );
}