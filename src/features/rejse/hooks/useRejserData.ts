import { useCallback, useEffect, useState } from "react";

import { api } from "../../../shared/api/api";
import { getErrorMessage } from "../../../shared/utils/error";
import type { Rejse } from "../model/rejse.types";

export function useRejserData() {
  const [rejser, setRejser] = useState<Rejse[]>([]);
  const [availableSeats, setAvailableSeats] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const list = await api.rejser.list();
      const rejseList = Array.isArray(list) ? list : [];

      setRejser(rejseList);

      const seatEntries = await Promise.all(
        rejseList.map(async (rejse) => {
          try {
            const seats = await api.bookings.getAvailableSeats(rejse.rejseId);
            return [rejse.rejseId, seats] as const;
          } catch {
            return [rejse.rejseId, rejse.maxSeats] as const;
          }
        })
      );

      setAvailableSeats(Object.fromEntries(seatEntries));
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Kunne ikke hente rejser."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    rejser,
    availableSeats,
    loading,
    error,
    refresh,
  };
}
