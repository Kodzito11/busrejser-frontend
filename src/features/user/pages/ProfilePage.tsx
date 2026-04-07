import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { userApi } from "../api/userApi";
import { getCurrentUser } from "../../auth/utils/auth.storage";
import type {
  ChangePasswordRequest,
  UpdateMyProfileRequest,
  UserProfile,
} from "../models/user.types";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [pageError, setPageError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [profileForm, setProfileForm] = useState<UpdateMyProfileRequest>({
    username: "",
    email: "",
    fullName: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState<
    ChangePasswordRequest & { confirmNewPassword: string }
  >({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const localUser = getCurrentUser();

    if (!localUser) {
      navigate("/login", { replace: true });
      return;
    }

    loadProfile();
  }, [navigate]);

  async function loadProfile() {
    setLoading(true);
    setPageError("");

    try {
      const me = await userApi.getMe();
      setUser(me);

      setProfileForm({
        username: me.username ?? "",
        email: me.email ?? "",
        fullName: me.fullName ?? "",
        phone: me.phone ?? "",
      });

      syncLocalStorageMe(me);
    } catch (e: any) {
      setPageError(e?.message ?? "Kunne ikke hente profil.");
    } finally {
      setLoading(false);
    }
  }

  function syncLocalStorageMe(profile: UserProfile) {
    const existing = getCurrentUser();

    localStorage.setItem(
      "me",
      JSON.stringify({
        userId: String(profile.userId),
        username: profile.username,
        email: profile.email,
        role: profile.role,
        fullName: profile.fullName ?? null,
        phone: profile.phone ?? null,
        createdAt: profile.createdAt,
        ...(existing ?? {}),
      })
    );
  }

  function onProfileFieldChange(
    field: keyof UpdateMyProfileRequest,
    value: string
  ) {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function onPasswordFieldChange(
    field: keyof typeof passwordForm,
    value: string
  ) {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const isCustomer = user?.role === "Kunde";
  const isStaff = user?.role === "Admin" || user?.role === "Medarbejder";

  const canSaveProfile = useMemo(() => {
    return (
      profileForm.username.trim().length > 0 &&
      profileForm.email.trim().length > 0
    );
  }, [profileForm]);

  const canChangePassword = useMemo(() => {
    return (
      passwordForm.currentPassword.trim().length > 0 &&
      passwordForm.newPassword.trim().length > 0 &&
      passwordForm.confirmNewPassword.trim().length > 0
    );
  }, [passwordForm]);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!canSaveProfile) return;

    setProfileError("");
    setProfileSuccess("");
    setSavingProfile(true);

    try {
      const updated = await userApi.updateMe({
        username: profileForm.username.trim(),
        email: profileForm.email.trim(),
        fullName: profileForm.fullName?.trim() || null,
        phone: profileForm.phone?.trim() || null,
      });

      setUser(updated);
      setProfileForm({
        username: updated.username ?? "",
        email: updated.email ?? "",
        fullName: updated.fullName ?? "",
        phone: updated.phone ?? "",
      });

      syncLocalStorageMe(updated);
      setProfileSuccess("Profil opdateret.");
    } catch (e: any) {
      setProfileError(e?.message ?? "Kunne ikke opdatere profil.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!canChangePassword) return;

    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError("Nyt password og gentag password matcher ikke.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Nyt password skal være mindst 6 tegn.");
      return;
    }

    setSavingPassword(true);

    try {
      await userApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setPasswordSuccess("Password opdateret.");
    } catch (e: any) {
      setPasswordError(e?.message ?? "Kunne ikke opdatere password.");
    } finally {
      setSavingPassword(false);
    }
  }

  function formatDate(value?: string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleString("da-DK");
  }

  if (loading) {
    return (
      <div className="pageContainer">
        <section className="card">
          <p className="muted">Indlæser profil...</p>
        </section>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="pageContainer">
        <section className="card">
          <h1>Min profil</h1>
          <div className="error">{pageError}</div>
          <div className="row" style={{ marginTop: 12 }}>
            <button onClick={loadProfile}>Prøv igen</button>
          </div>
        </section>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pageContainer">
      <section className="card">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>Min profil</h1>
            <p className="muted">
              Se og opdatér dine kontooplysninger.
            </p>
          </div>

          <button className="ghost" onClick={loadProfile}>
            Genindlæs
          </button>
        </div>
      </section>

      <br />

      <section className="card">
        <h2>Kontooplysninger</h2>
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: 12 }}
        >
          <div>
            <strong>Brugernavn</strong>
            <div>{user.username}</div>
          </div>

          <div>
            <strong>Email</strong>
            <div>{user.email}</div>
          </div>

          <div>
            <strong>Fulde navn</strong>
            <div>{user.fullName || "-"}</div>
          </div>

          <div>
            <strong>Telefon</strong>
            <div>{user.phone || "-"}</div>
          </div>

          <div>
            <strong>Rolle</strong>
            <div>{user.role}</div>
          </div>

          <div>
            <strong>Konto oprettet</strong>
            <div>{formatDate(user.createdAt)}</div>
          </div>
        </div>
      </section>

      <br />

      <section className="card">
        <h2>Rediger profil</h2>

        {profileError && <div className="error">{profileError}</div>}
        {profileSuccess && <div className="success">{profileSuccess}</div>}

        <form onSubmit={handleProfileSubmit} className="authForm" style={{ marginTop: 12 }}>
          <label>
            Brugernavn
            <input
              type="text"
              value={profileForm.username}
              onChange={(e) => onProfileFieldChange("username", e.target.value)}
              placeholder="Brugernavn"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => onProfileFieldChange("email", e.target.value)}
              placeholder="din@email.dk"
            />
          </label>

          <label>
            Fulde navn
            <input
              type="text"
              value={profileForm.fullName ?? ""}
              onChange={(e) => onProfileFieldChange("fullName", e.target.value)}
              placeholder="Dit navn"
            />
          </label>

          <label>
            Telefon
            <input
              type="text"
              value={profileForm.phone ?? ""}
              onChange={(e) => onProfileFieldChange("phone", e.target.value)}
              placeholder="Fx 12345678"
            />
          </label>

          <div className="row">
            <button type="submit" disabled={!canSaveProfile || savingProfile}>
              {savingProfile ? "Gemmer..." : "Gem ændringer"}
            </button>
          </div>
        </form>
      </section>

      <br />

      <section className="card">
        <h2>Sikkerhed</h2>
        <p className="muted">Skift dit password her.</p>

        {passwordError && <div className="error">{passwordError}</div>}
        {passwordSuccess && <div className="success">{passwordSuccess}</div>}

        <form onSubmit={handlePasswordSubmit} className="authForm" style={{ marginTop: 12 }}>
          <label>
            Nuværende password
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                onPasswordFieldChange("currentPassword", e.target.value)
              }
              placeholder="Nuværende password"
            />
          </label>

          <label>
            Nyt password
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                onPasswordFieldChange("newPassword", e.target.value)
              }
              placeholder="Nyt password"
            />
          </label>

          <label>
            Gentag nyt password
            <input
              type="password"
              value={passwordForm.confirmNewPassword}
              onChange={(e) =>
                onPasswordFieldChange("confirmNewPassword", e.target.value)
              }
              placeholder="Gentag nyt password"
            />
          </label>

          <div className="row">
            <button type="submit" disabled={!canChangePassword || savingPassword}>
              {savingPassword ? "Opdaterer..." : "Opdater password"}
            </button>
          </div>
        </form>
      </section>

      <br />

      <section className="card">
        <h2>Hurtige handlinger</h2>
        <div className="row" style={{ flexWrap: "wrap", marginTop: 12 }}>
          {isCustomer && (
            <button onClick={() => navigate("/mine-bookinger")}>
              Se mine bookinger
            </button>
          )}

          {isCustomer && (
            <button className="ghost" onClick={() => navigate("/kunde")}>
              Gå til dashboard
            </button>
          )}

          {isStaff && (
            <button onClick={() => navigate("/admin")}>
              Gå til admin panel
            </button>
          )}
        </div>
      </section>
    </div>
  );
}