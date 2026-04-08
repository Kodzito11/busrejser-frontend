import type { MeResponse } from "../model/auth.types";

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("me");
}

export function getCurrentUser(): MeResponse | null {
  const raw = localStorage.getItem("me");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as MeResponse;
  } catch {
    localStorage.removeItem("me");
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