type Props = {
  userId: number | null;
  role?: string | null;
};

export default function BookingUserTypeBadge({ userId, role }: Props) {
  if (userId == null) {
    return <span className="roleBadge gaest">Gæst</span>;
  }

  const label = role ?? "Bruger";
  const className = label.toLowerCase();

  return <span className={`roleBadge ${className}`}>{label}</span>;
}