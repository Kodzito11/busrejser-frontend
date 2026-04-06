import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../../../shared/api/api";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      setErr("Ugyldigt link.");
      return;
    }

    setErr("");
    setSuccess("");
    setLoading(true);

    try {
      await api.auth.resetPassword({
        token,
        newPassword: password,
      });

      setSuccess("Password opdateret.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (e: any) {
      setErr(e?.message ?? "Noget gik galt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pageContainer">
      <section className="card authCard">
        <h1>Nyt password</h1>

        {err && <div className="error">{err}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit} className="authForm">
          <label>
            Nyt password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button disabled={loading || !password}>
            {loading ? "Opdaterer..." : "Opdater password"}
          </button>
        </form>
      </section>
    </div>
  );
}