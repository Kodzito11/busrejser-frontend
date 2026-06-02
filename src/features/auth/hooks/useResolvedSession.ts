import { useEffect, useState } from "react";

import { authApi } from "../api/authApi";
import type { MeResponse } from "../model/auth.types";

import {
  clearSession,
  getCurrentUser,
  saveAccessToken,
  saveCurrentUser,
} from "../utils/auth.storage";

import { devLog } from "../../../shared/utils/devLog";

export function useResolvedSession() {
  const [user, setUser] = useState<MeResponse | null>(() => getCurrentUser());
  const [loading, setLoading] = useState(() => !getCurrentUser());

  useEffect(() => {
    let cancelled = false;

    async function resolveSession() {
      devLog("AUTH", "useResolvedSession:start");

      const existingUser = getCurrentUser();

      if (existingUser) {
        devLog("AUTH", "local user found", {
          userId: existingUser.userId,
          role: existingUser.role,
        });
      }

      setLoading(true);

      try {
        if (!existingUser) {
          devLog("AUTH", "no local user -> trying refresh");

          const refreshed = await authApi.refresh();

          devLog("AUTH", "refresh success -> saving access token");
          saveAccessToken(refreshed.accessToken);
        }

        devLog("AUTH", "fetching /me to resolve current session");
        const me = await authApi.me();

        devLog("AUTH", "/me success -> session resolved", {
          userId: me.userId,
          role: me.role,
        });

        saveCurrentUser(me);

        if (!cancelled) {
          setUser(me);
        }
      } catch (error) {
        devLog("AUTH", "session restore failed -> clearing session", error);

        clearSession();

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          devLog("AUTH", "useResolvedSession:finished");
          setLoading(false);
        }
      }
    }

    resolveSession();

    return () => {
      cancelled = true;
      devLog("AUTH", "useResolvedSession:cancelled");
    };
  }, []);

  return { user, loading };
}
