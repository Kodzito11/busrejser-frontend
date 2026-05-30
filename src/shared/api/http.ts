import {
  clearSession,
  getAccessToken,
  saveAccessToken,
} from "../../features/auth/utils/auth.storage";

import { devLog } from "../utils/devLog";

export const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

type HttpOptions = {
  skipAuthRefresh?: boolean;
};

let refreshPromise: Promise<boolean> | null = null;

export async function http<T>(
  path: string,
  options?: RequestInit,
  httpOptions?: HttpOptions
): Promise<T> {
  const res = await sendRequest(path, options);

  if (res.status === 401 && !httpOptions?.skipAuthRefresh) {
    devLog("AUTH", "http 401 received -> trying refresh", { path });

    const refreshed = await refreshAccessToken();

    if (refreshed) {
      devLog("AUTH", "refresh success -> retrying original request", { path });

      const retryRes = await sendRequest(path, options);
      return handleResponse<T>(retryRes);
    }

    devLog("AUTH", "refresh failed -> clearing session", { path });
    clearSession();
  }

  return handleResponse<T>(res);
}

async function sendRequest(path: string, options?: RequestInit) {
  const token = getAccessToken();
  const isFormData = options?.body instanceof FormData;

  devLog("HTTP", "sending request", {
    path,
    method: options?.method ?? "GET",
    hasToken: !!token,
    isFormData,
  });

  return fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });
}

async function refreshAccessToken() {
  if (refreshPromise) {
    devLog("AUTH", "refresh already in progress -> waiting");
    return refreshPromise;
  }

  devLog("AUTH", "starting refresh request");

  refreshPromise = doRefresh().finally(() => {
    devLog("AUTH", "refresh promise cleared");
    refreshPromise = null;
  });

  return refreshPromise;
}

async function doRefresh() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      devLog("AUTH", "refresh response not ok", {
        status: res.status,
        statusText: res.statusText,
      });

      return false;
    }

    const data = await res.json();

    if (!data?.accessToken) {
      devLog("AUTH", "refresh response missing accessToken");
      return false;
    }

    saveAccessToken(data.accessToken);

    devLog("AUTH", "access token saved after refresh");

    return true;
  } catch (error) {
    devLog("AUTH", "refresh request crashed", error);
    return false;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;

    try {
      const data = await res.json();
      if (data?.message || data?.Message) {
        message = data.message ?? data.Message;
      }
    } catch {
      const text = await res.text().catch(() => "");
      if (text) message = text;
    }

    devLog("HTTP", "request failed", {
      status: res.status,
      statusText: res.statusText,
      message,
    });

    throw new Error(message);
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return undefined as T;

  return (await res.json()) as T;
}