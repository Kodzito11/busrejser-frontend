import { useEffect, useState } from "react";

import { authApi } from "../api/authApi";
import type { MeResponse } from "../model/auth.types";
import {
  clearSession,
  getCurrentUser,
  saveAccessToken,
  saveCurrentUser,
} from "../utils/auth.storage";

export function useResolvedSession() {
  const [user, setUser] = useState<MeResponse | null>(() => getCurrentUser());
  const [loading, setLoading] = useState(() => !getCurrentUser());

  useEffect(() => {
    let cancelled = false;

    async function resolveSession() {
      const existingUser = getCurrentUser();

      if (existingUser) {
        setUser(existingUser);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const refreshed = await authApi.refresh();
        saveAccessToken(refreshed.accessToken);

        const me = await authApi.me();
        saveCurrentUser(me);

        if (!cancelled) {
          setUser(me);
        }
      } catch {
        clearSession();

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    resolveSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}