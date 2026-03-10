import { useMemo } from "react";
import type { Rejse } from "../api";

function ymd(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// date-only (så tidzoner ikke flytter dag)
function toDateOnly(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function buildTripsByDate(trips: Rejse[]) {
  const map: Record<string, Rejse[]> = {};

  for (const t of trips) {
    const start = toDateOnly(new Date(t.startAt));
    const end = toDateOnly(new Date(t.endAt));

    if (end < start) continue;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = ymd(d);
      (map[key] ??= []).push(t);
    }
  }

  return map;
}

type Props = {
  trips: Rejse[];
  currentMonth: Date;
};

export default function TripCalendar({ trips, currentMonth }: Props) {
  const tripsByDate = useMemo(() => buildTripsByDate(trips), [trips]);

  const days = useMemo(() => {
    const first = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const start = new Date(first);
    const weekday = (start.getDay() + 6) % 7; // mandag=0
    start.setDate(start.getDate() - weekday);

    const arr: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [currentMonth]);

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

  return (
    <section className="card">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 8 }}>
        {weekDays.map((w) => (
          <div key={w} style={{ opacity: 0.7, fontSize: 12, paddingLeft: 6 }}>{w}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
        {days.map((d) => {
          const key = ymd(d);
          const list = tripsByDate[key] || [];
          const inMonth = d.getMonth() === month && d.getFullYear() === year;

          return (
            <div
              key={key}
              style={{
                minHeight: 110,
                padding: 10,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                opacity: inMonth ? 1 : 0.45,
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.7 }}>{d.getDate()}</div>

              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                {list.slice(0, 3).map((t) => (
                  <div
                    key={t.rejseId}
                    title={`${t.title} (${new Date(t.startAt).toLocaleString()} → ${new Date(t.endAt).toLocaleString()})`}
                    style={{
                      padding: "4px 6px",
                      borderRadius: 8,
                      fontSize: 12,
                      border: "1px solid rgba(255,255,255,0.10)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.title}
                  </div>
                ))}
                {list.length > 3 && (
                  <div style={{ fontSize: 12, opacity: 0.6 }}>+{list.length - 3} mere</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}