import { useState } from "react";
import { api } from "../../shared/api/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErr("");
    setSuccess("");
    setLoading(true);

    try {
      await api.auth.forgotPassword({ email });
      setSuccess("Hvis email findes, er link sendt.");
    } catch (e: any) {
      setErr(e?.message ?? "Noget gik galt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pageContainer">
      <section className="card authCard">
        <h1>Nulstil password</h1>

        {err && <div className="error">{err}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit} className="authForm">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.dk"
            />
          </label>

          <button disabled={loading || !email}>
            {loading ? "Sender..." : "Send reset link"}
          </button>
        </form>
      </section>
    </div>
  );
}