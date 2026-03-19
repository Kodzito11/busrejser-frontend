import type { Rejse } from "../model/rejse.types";
import { getStatus, getStatusClassName } from "../utils/rejseHelpers";

type Props = {
  rejse: Rejse;
};

export default function RejseStatusBadge({ rejse }: Props) {
  const status = getStatus(rejse);
  const className = getStatusClassName(rejse);

  return (
    <span className={`statusBadge ${className}`}>
      {status}
    </span>
  );
}