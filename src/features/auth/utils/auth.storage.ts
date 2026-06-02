import type { MeResponse } from "../model/auth.types";

const ACCESS_TOKEN_KEY = "token";
const CURRENT_USER_KEY = "me";
export const AUTH_SESSION_CHANGED_EVENT = "busplanen:auth-session-changed";

type SaveSessionInput = {
  accessToken: string;
  user?: MeResponse | null;
};

export function saveSession({ accessToken, user }: SaveSessionInput) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  notifySessionChanged();
}

export function saveAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  notifySessionChanged();
}

export function saveCurrentUser(user: MeResponse) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  notifySessionChanged();
}

export function getToken() {
  return getAccessToken();
}

export function getAccessToken() {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!token || token === "undefined" || token === "null") {
    return null;
  }

  return token;
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  notifySessionChanged();
}

export function logout() {
  clearSession();
}

export function getCurrentUser(): MeResponse | null {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as MeResponse;
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function hasRole(...roles: string[]) {
  const user = getCurrentUser();
  if (!user) return false;
  return roles.includes(user.role);
}

export function isAdmin() {
  return hasRole("Admin");
}

export function isEmployee() {
  return hasRole("Medarbejder");
}

export function canManageBuses() {
  return hasRole("Admin", "Medarbejder");
}

export function isStaff() {
  return hasRole("Admin", "Medarbejder");
}

function notifySessionChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}
