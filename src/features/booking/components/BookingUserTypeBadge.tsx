import type { Booking } from "../model/booking.types";

type Props = {
  booking: Booking;
};

export default function BookingUserTypeBadge({ booking }: Props) {
  if (booking.userId == null) {
    return <span className="roleBadge gaest">Gæst</span>;
  }

  const role = booking.role ?? "Bruger";
  const className = role.toLowerCase();

  return <span className={`roleBadge ${className}`}>{role}</span>;
}