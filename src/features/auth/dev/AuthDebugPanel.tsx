import { useState } from "react";
import {
  getAccessToken,
  getCurrentUser,
  saveAccessToken,
} from "../utils/auth.storage";
import {api} from "../../../shared/api/api";

function decodeJwt(token: string | null) {
  if (!token) return null;

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    return JSON.parse(atob(payloadPart));
  } catch {
    return null;
  }
}

function getTimeLeft(exp?: number) {
  if (!exp) return "Ukendt";

  const msLeft = exp * 1000 - Date.now();

  if (msLeft <= 0) return "Udløbet";

  const totalSeconds = Math.floor(msLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}m ${seconds}s`;
}

export function AuthDebugPanel() {
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!import.meta.env.DEV) return null;

  const accessToken = getAccessToken();
  const user = getCurrentUser();
  const payload = decodeJwt(accessToken);

  const expiresAt = payload?.exp
    ? new Date(payload.exp * 1000).toLocaleString("da-DK")
    : "Ukendt";

  const debugInfo = {
    checkedAt: new Date().toISOString(),
    user,
    hasAccessToken: !!accessToken,
    accessTokenExpiresAt: expiresAt,
    accessTokenTimeLeft: getTimeLeft(payload?.exp),
    jwtPayload: payload,
    localStorageKeys: {
      token: !!localStorage.getItem("token"),
      refreshToken: !!localStorage.getItem("refreshToken"),
      me: !!localStorage.getItem("me"),
    },
  };

  async function refreshAuthSession() {
  try {
    const response = await api.auth.refresh();

    if (response.accessToken) {
      saveAccessToken(response.accessToken);
    }
    
    refreshPanel();
  } catch (error) {
    console.error("Auth refresh failed", error);
  }
}

  async function copyDebugInfo() {
    await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function refreshPanel() {
    setRefreshKey((x) => x + 1);
  }

  function clearLocalSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("me");
    refreshPanel();
  }

  return (
    <div
      key={refreshKey}
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 9999,
        width: 340,
        padding: 12,
        background: "#111827",
        color: "#fff",
        borderRadius: 12,
        fontSize: 12,
        boxShadow: "0 12px 32px rgba(0,0,0,.35)",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>
        Auth Dev Panel
      </div>

      <div style={{ display: "grid", gap: 4 }}>
        <div>Email: {user?.email ?? "Ingen"}</div>
        <div>Role: {user?.role ?? "Ingen"}</div>
        <div>Access token: {accessToken ? "Ja" : "Nej"}</div>
        <div>JWT expires: {expiresAt}</div>
        <div>Time left: {getTimeLeft(payload?.exp)}</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button
          type="button"
          onClick={refreshAuthSession}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: 0,
            cursor: "pointer",
          }}
        >
          Refresh
        </button>

        <button
          type="button"
          onClick={copyDebugInfo}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: 0,
            cursor: "pointer",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <button
        type="button"
        onClick={clearLocalSession}
        style={{
          marginTop: 8,
          width: "100%",
          padding: 8,
          borderRadius: 8,
          border: 0,
          cursor: "pointer",
          background: "#fecaca",
        }}
      >
        Clear local session
      </button>
    </div>
  );
}