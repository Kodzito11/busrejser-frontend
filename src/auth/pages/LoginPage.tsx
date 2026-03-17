import { useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../../shared/api/api";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setErr("");
    setLoading(true);

    try {
      const res = await api.auth.login({ email, password });
      localStorage.setItem("token", res.token);

      const me = await api.auth.me();
      localStorage.setItem("me", JSON.stringify(me));

      window.location.href = "/";
    } catch (e: any) {
      setErr(e?.message ?? "Login fejlede.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pageContainer">
      <section className="card authCard">
        <h1 className="login">Login</h1>

        {err && <div className="error">{err}</div>}

        <form onSubmit={handleLogin} className="authForm">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.dk"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <div className="row">
            <button type="submit" disabled={loading || !canSubmit}>
              {loading ? "Logger ind..." : "Log ind"}
            </button>
            {!canSubmit && <span className="muted">Email og password kræves</span>}
          </div>

          <div className="authSwitch">
            <span className="muted">Har du ikke en bruger?</span>
            <Link to="/register">Opret en her</Link>
          </div>
        </form>
      </section>
    </div>
  );
}