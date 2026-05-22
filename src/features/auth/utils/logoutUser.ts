import { api } from "../../../shared/api/api";
import { clearSession, getRefreshToken } from "./auth.storage";

export async function logoutUser() {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await api.auth.logout({ refreshToken });
    }
  } finally {
    clearSession();
  }
}