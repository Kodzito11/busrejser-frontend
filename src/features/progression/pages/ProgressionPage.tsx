import { useEffect, useState } from "react";
import { api } from "../../../shared/api/api";

import type { ProgressionMapResponse } from "../model/progression.types";
import ProgressionMap from "../components/ProgressionMap";

import BadgeGrid from "../../badges/components/BadgeGrid";
import type { Badge, UserBadge } from "../../badges/model/badge.types";

import "../../../styles/features/progression/progression.css";

export default function ProgressionPage() {
  const [data, setData] = useState<ProgressionMapResponse | null>(null);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setErr("");
        setLoading(true);

        const [mapResult, allBadgeResult, mineBadgeResult] = await Promise.all([
          api.progression.getMap(),
          api.badges.getAll(),
          api.badges.getMine(),
        ]);

        setData(mapResult);
        setAllBadges(allBadgeResult);
        setEarnedBadges(mineBadgeResult);
      } catch (e: any) {
        setErr(e?.message ?? "Kunne ikke hente progression.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="wrap">
        <div className="card">Loader progression...</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="wrap">
        <div className="error">{err}</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="wrap">
      <header className="header">
        <div>
          <h1>Min progression</h1>
          <p className="muted">
            Se dine gennemførte rejser, destinationer og udvikling.
          </p>
        </div>
      </header>

      <section
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        <div className="card">
          <p className="muted">Besøgte lokationer</p>
          <h2>{data.visitedLocationCount}</h2>
        </div>

        <div className="card">
          <p className="muted">Besøgte lande</p>
          <h2>{data.visitedCountryCount}</h2>
        </div>

        <div className="card">
          <p className="muted">Optjente badges</p>
          <h2>{earnedBadges.length}</h2>
        </div>
      </section>

      <br />

      <section className="card">
        <h2>Dit rejsekort</h2>
        <p className="muted">Dine gennemførte rejser vist på kort.</p>

        <br />

        <ProgressionMap locations={data.locations} />
      </section>

      <br />

      <section className="card">
        <h2>Mine badges</h2>
        <p className="muted">Badges du har optjent gennem dine rejser.</p>

        <br />

        <BadgeGrid allBadges={allBadges} earnedBadges={earnedBadges} />
      </section>
    </div>
  );
}