import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { userApi } from "../api/userApi";
import type { UserProfile } from "../models/user.types";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const me = userApi.getMe();

    if (!me) {
      navigate("/login");
      return;
    }

    setUser(me);
  }, [navigate]);

  if (!user) {
    return <p>Indlæser...</p>;
  }

  const isCustomer = user.role === "Kunde";
  const isStaff = user.role === "Admin" || user.role === "Medarbejder";

  return (
    <div className="container">
      <h1>Min profil</h1>

      <div className="card">
        <h3>Brugeroplysninger</h3>
        <p><strong>Brugernavn:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rolle:</strong> {user.role}</p>
      </div>

      {isCustomer && (
        <div className="card">
          <h3>Kunde</h3>
          <button onClick={() => navigate("/mine-bookinger")}>
            Se mine bookinger
          </button>
        </div>
      )}

      {isStaff && (
        <div className="card">
          <h3>Administration</h3>
          <button onClick={() => navigate("/admin")}>
            Gå til admin panel
          </button>
        </div>
      )}
    </div>
  );
}