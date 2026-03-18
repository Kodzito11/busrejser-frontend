import { useNavigate } from "react-router-dom";

export default function AdminHomePage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="card">
        <h1>Admin panel</h1>
        <p className="muted">
          Administrér busser, rejser og bookinger.
        </p>
      </div>

      <div className="adminGrid">
        <div className="adminCard" onClick={() => navigate("/admin/busser")}>
          <h3>Busser</h3>
          <p className="muted">
            Opret, redigér og administrér busser.
          </p>
        </div>

        <div className="adminCard" onClick={() => navigate("/admin/rejser")}>
          <h3>Rejser</h3>
          <p className="muted">
            Planlæg og vedligehold rejser.
          </p>
        </div>

        <div className="adminCard" onClick={() => navigate("/admin/bookings")}>
          <h3>Bookings</h3>
          <p className="muted">
            Se og administrér kundebookinger.
          </p>
        </div>
      </div>
    </div>
  );
}