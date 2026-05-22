import { api } from "../../../shared/api/api";
import { clearSession } from "./auth.storage";

export async function logoutUser() {
  try {
    await api.auth.logout();
  } finally {
    clearSession();
  }
}