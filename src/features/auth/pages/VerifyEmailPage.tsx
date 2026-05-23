import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../../shared/api/api";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setErr("Ugyldigt bekræftelseslink.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.auth.verifyEmail({ token });
        setSuccess(response.message || "Din email er bekræftet.");
      } catch (e: any) {
        setErr(e?.message ?? "Linket er ugyldigt eller udløbet.");
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [token]);

  return (
    <div className="pageContainer">
      <section className="card authCard">
        <h1>Bekræft email</h1>

        {loading && <p>Bekræfter din email...</p>}
        {err && <div className="error">{err}</div>}
        {success && <div className="success">{success}</div>}

        {!loading && (
          <div style={{ marginTop: "1rem" }}>
            <Link to="/login" className="btn">
              Gå til login
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}