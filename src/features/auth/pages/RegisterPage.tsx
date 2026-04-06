import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../../../shared/api/api";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const canSubmit =
    username.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setErr("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.auth.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      setSuccess(res.message || "Bruger oprettet.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (e: any) {
      setErr(e?.message ?? "Registrering fejlede.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pageContainer">
      <section className="card authCard">
        <h1 className="login">Opret bruger</h1>

        {err && <div className="error">{err}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleRegister} className="authForm">
          <label>
            Brugernavn
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Dit brugernavn"
            />
          </label>

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
                          {loading ? "Opretter..." : "Opret bruger"}
                      </button>
                  </div>
        </form>

        <div className="authSwitch">
          <span className="muted">Har du allerede en bruger?</span>
          <Link to="/login">Gå til login</Link>
        </div>
      </section>
    </div>
  );
}