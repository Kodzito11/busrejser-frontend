import {
  clearSession,
  getAccessToken,
  saveAccessToken,
} from "../../features/auth/utils/auth.storage";

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

  if (
    res.status === 401 &&
    !httpOptions?.skipAuthRefresh
  ) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      const retryRes = await sendRequest(path, options);
      return handleResponse<T>(retryRes);
    }

    clearSession();
  }

  return handleResponse<T>(res);
}

async function sendRequest(path: string, options?: RequestInit) {
  const token = getAccessToken();
  const isFormData = options?.body instanceof FormData;

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
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }

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
      return false;
    }

    const data = await res.json();

    if (!data?.accessToken) {
      return false;
    }

    saveAccessToken(data.accessToken);

    return true;
  } catch {
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

    throw new Error(message);
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return undefined as T;

  return (await res.json()) as T;
}