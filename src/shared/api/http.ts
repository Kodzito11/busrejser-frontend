export const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  const isFormData = options?.body instanceof FormData;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });

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
