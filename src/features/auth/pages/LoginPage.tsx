import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../../../shared/api/api";
import { getCurrentUser } from "../utils/auth.storage";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    if (user.role === "Admin" || user.role === "Medarbejder") {
      navigate("/admin", { replace: true });
      return;
    }
    if (user.role === "Kunde") {
      navigate("/kunde", { replace: true });
      return;
    }

    navigate("/", { replace: true });
  }, [navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setErr("");
    setLoading(true);

    try {
      const res = await api.auth.login({
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", res.accessToken);

      const me = await api.auth.me();
      localStorage.setItem("me", JSON.stringify(me));

      if (me.role === "Admin" || me.role === "Medarbejder") {
        navigate("/admin", { replace: true });
      } else if (me.role === "Kunde") {
        navigate("/kunde", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (e: any) {
      setErr(e?.message ?? "Login fejlede.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pageContainer">
      <section className="card authCard">
        <div className="authIntro">
          <h1 className="login">Velkommen tilbage</h1>
          <p className="muted">
            Log ind for at se dine bookinger og administrere din konto.
          </p>
        </div>

        {err && <div className="error">{err}</div>}

        <form onSubmit={handleLogin} className="authForm">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.dk"
              autoComplete="email"
            />
          </label>

          <div className="passwordBlock">
            <label htmlFor="password">Password</label>

            <div className="passwordField">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="passwordToggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Skjul" : "Vis"}
              </button>
            </div>
          </div>

          <div className="row">
            <button type="submit" disabled={loading || !canSubmit}>
              {loading ? "Logger ind..." : "Log ind"}
            </button>
          </div>

          <div className="forgotPassword">
            <Link to="/glemt-adgangskode" className="authLink">
              Glemt adgangskode?
            </Link>
          </div>

          {!canSubmit && (
            <div className="formHint">
              <span className="muted">Email og password kræves</span>
            </div>
          )}
        </form>

        <div className="authSwitch">
          <span className="muted">Har du ikke en bruger?</span>
          <Link to="/register">Opret en her</Link>
        </div>
      </section>
    </div>
  );
}