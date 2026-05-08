import { useEffect, useMemo, useState } from "react";
import { api } from "../../../shared/api/api";

import type { ProgressionMapResponse } from "../model/progression.types";
import type { SelectedProgressionZoneKey } from "../model/progressionView.types";

import ProgressionMap from "../components/ProgressionMap";
import ProgressionSidebar from "../components/ProgressionSidebar";
import RegionProgressList from "../components/RegionProgressList";

import { buildProgressionZones } from "../game/progressionZones";

import BadgeGrid from "../../badges/components/BadgeGrid";
import type { Badge, UserBadge } from "../../badges/model/badge.types";
import TravelHistoryList from "../../travel-history/components/TravelHistoryList";
import type { TravelHistoryItem } from "../../travel-history/model/travelHistory.types";

import "../../../styles/features/progression/progression.css";

export default function ProgressionPage() {
  const [data, setData] = useState<ProgressionMapResponse | null>(null);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [travelHistory, setTravelHistory] = useState<TravelHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedZoneKey, setSelectedZoneKey] =
    useState<SelectedProgressionZoneKey>(null);

  useEffect(() => {
    async function load() {
      try {
        setErr("");
        setLoading(true);

        const [
          mapResult,
          allBadgeResult,
          mineBadgeResult,
          travelHistoryResult,
        ] = await Promise.all([
          api.progression.getMap(),
          api.badges.getAll(),
          api.badges.getMine(),
          api.travelHistory.getMine(),
        ]);

        setData(mapResult);
        setAllBadges(allBadgeResult);
        setEarnedBadges(mineBadgeResult);
        setTravelHistory(travelHistoryResult);
      } catch (e: any) {
        setErr(e?.message ?? "Kunne ikke hente progression.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const zones = useMemo(
    () => buildProgressionZones(data?.locations ?? []),
    [data?.locations]
  );

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
          <p className="muted">Gennemførte rejser</p>
          <h2>{travelHistory.length}</h2>
        </div>

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
        <div className="progression-dashboard">
          <div className="progression-dashboard__map">
            <h2>Dit rejsekort</h2>
            <p className="muted">
              Udforsk verden og følg din progression.
            </p>

            <ProgressionMap
              locations={data.locations}
              selectedZoneKey={selectedZoneKey}
              onSelectZone={setSelectedZoneKey}
            />
          </div>

          <ProgressionSidebar
            zones={zones}
            selectedZoneKey={selectedZoneKey}
            onSelectZone={setSelectedZoneKey}
          />
        </div>
      </section>

      <br />

      <section className="card">
        <h2>Gennemførte rejser</h2>
        <p className="muted">Dine afsluttede rejser vises her.</p>

        <br />

        <TravelHistoryList items={travelHistory} />
      </section>

      <br />

      <section className="card">
        <h2>Mine badges</h2>
        <p className="muted">Badges du har optjent gennem dine rejser.</p>

        <br />

        <BadgeGrid allBadges={allBadges} earnedBadges={earnedBadges} />
      </section>

      <br />

      <section className="card">
        <h2>Regioner</h2>
        <p className="muted">
          Se hvilke områder du allerede har begyndt at udforske.
        </p>

        <br />

        <RegionProgressList regions={data.regions ?? []} />
      </section>
    </div>
  );
}