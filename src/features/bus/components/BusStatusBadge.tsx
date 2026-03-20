type Props = {
  status: number;
};

export default function BusStatusBadge({ status }: Props) {
  let label = "";
  let className = "badge";

  switch (status) {
    case 0:
      label = "Aktiv";
      className += " success";
      break;
    case 1:
      label = "Inaktiv";
      className += " muted";
      break;
    case 2:
      label = "Vedligeholdelse";
      className += " warning";
      break;
    default:
      label = `(${status})`;
      className += " muted";
  }

  return <span className={className}>{label}</span>;
}