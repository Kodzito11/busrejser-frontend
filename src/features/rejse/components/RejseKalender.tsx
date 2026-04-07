import { useEffect, useMemo, useState } from "react";
import type { Rejse } from "../model/rejse.types";
import "../../../styles/rejseKalender.css";

function ymd(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

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

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("da-DK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("da-DK").format(value);
}

type Props = {
  trips: Rejse[];
  currentMonth: Date;
  availableSeats?: Record<number, number>;
  onTripClick?: (trip: Rejse) => void;
};

export default function TripCalendar({
  trips,
  currentMonth,
  availableSeats = {},
  onTripClick,
}: Props) {
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const tripsByDate = useMemo(() => buildTripsByDate(trips), [trips]);

  const days = useMemo(() => {
    const first = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const start = new Date(first);
    const weekday = (start.getDay() + 6) % 7; // mandag = 0
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
  const todayKey = ymd(new Date());

  useEffect(() => {
    const daysInMonth = days.filter(
      (d) => d.getMonth() === month && d.getFullYear() === year
    );

    const firstDayWithTrips = daysInMonth.find((d) => {
      const key = ymd(d);
      return (tripsByDate[key] ?? []).length > 0;
    });

    if (firstDayWithTrips) {
      setSelectedDateKey(ymd(firstDayWithTrips));
      return;
    }

    const firstDayOfMonth = daysInMonth[0];
    setSelectedDateKey(firstDayOfMonth ? ymd(firstDayOfMonth) : null);
  }, [currentMonth, days, month, year, tripsByDate]);

  const selectedTrips = useMemo(() => {
    if (!selectedDateKey) return [];
    return [...(tripsByDate[selectedDateKey] ?? [])].sort((a, b) => {
      const aTime = new Date(a.startAt).getTime();
      const bTime = new Date(b.startAt).getTime();
      return aTime - bTime;
    });
  }, [selectedDateKey, tripsByDate]);

  const selectedDate = useMemo(() => {
    if (!selectedDateKey) return null;
    const [y, m, d] = selectedDateKey.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [selectedDateKey]);

  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

  function getSeatsLeft(trip: Rejse) {
    return availableSeats[trip.rejseId] ?? Math.max(0, trip.maxSeats - (trip.bookedSeats ?? 0));
  }

  function getTripStatus(trip: Rejse) {
    const seatsLeft = getSeatsLeft(trip);

    if (seatsLeft <= 0) {
      return {
        label: "Udsolgt",
        className: "calendarTrip--soldout",
      };
    }

    if (seatsLeft <= 5) {
      return {
        label: "Få pladser",
        className: "calendarTrip--low",
      };
    }

    return {
      label: `${seatsLeft} ledige`,
      className: "calendarTrip--available",
    };
  }

  return (
    <section className="card tripCalendar">
      <div className="tripCalendar__layout">
        <div className="tripCalendar__main">
          <div className="tripCalendar__weekdays">
            {weekDays.map((w) => (
              <div key={w} className="tripCalendar__weekday">
                {w}
              </div>
            ))}
          </div>

          <div className="tripCalendar__grid">
            {days.map((d) => {
              const key = ymd(d);
              const list = tripsByDate[key] ?? [];
              const inMonth = d.getMonth() === month && d.getFullYear() === year;
              const isToday = key === todayKey;
              const isSelected = key === selectedDateKey;
              const featuredCount = list.filter((t) => t.isFeatured).length;

              return (
                <button
                  key={key}
                  type="button"
                  className={[
                    "tripCalendar__day",
                    !inMonth ? "tripCalendar__day--outside" : "",
                    isToday ? "tripCalendar__day--today" : "",
                    isSelected ? "tripCalendar__day--selected" : "",
                    list.length > 0 ? "tripCalendar__day--hasTrips" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setSelectedDateKey(key)}
                >
                  <div className="tripCalendar__dayTop">
                    <span className="tripCalendar__dateNumber">{d.getDate()}</span>

                    {list.length > 0 && (
                      <span className="tripCalendar__count">{list.length}</span>
                    )}
                  </div>

                  {featuredCount > 0 && (
                    <div className="tripCalendar__featuredHint">
                      ⭐ {featuredCount} featured
                    </div>
                  )}

                  <div className="tripCalendar__previewList">
                    {list.slice(0, 3).map((trip) => {
                      const status = getTripStatus(trip);

                      return (
                        <div
                          key={trip.rejseId}
                          className={[
                            "calendarTrip",
                            status.className,
                            trip.isFeatured ? "calendarTrip--featured" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          title={`${trip.title} • ${formatDateTime(trip.startAt)}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTripClick?.(trip);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onTripClick?.(trip);
                            }
                          }}
                        >
                          <span className="calendarTrip__title">{trip.title}</span>
                          <span className="calendarTrip__meta">{trip.destination}</span>
                        </div>
                      );
                    })}

                    {list.length > 3 && (
                      <div className="tripCalendar__more">+{list.length - 3} mere</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="tripCalendar__sidebar">
          <div className="tripCalendar__sidebarHeader">
            <h3>{selectedDate ? formatDayLabel(selectedDate) : "Vælg en dag"}</h3>
            <p className="muted">
              {selectedTrips.length === 0
                ? "Ingen rejser denne dag"
                : `${selectedTrips.length} rejse${selectedTrips.length > 1 ? "r" : ""}`}
            </p>
          </div>

          {selectedTrips.length === 0 ? (
            <div className="tripCalendar__empty">
              Ingen planlagte rejser på denne dato.
            </div>
          ) : (
            <div className="tripCalendar__tripList">
              {selectedTrips.map((trip) => {
                const seatsLeft = getSeatsLeft(trip);
                const status = getTripStatus(trip);

                return (
                  <article key={trip.rejseId} className="tripCalendarCard">
                    <div className="tripCalendarCard__top">
                      <div>
                        <div className="tripCalendarCard__titleRow">
                          <h4>{trip.title}</h4>
                          {trip.isFeatured && (
                            <span className="tripCalendarCard__featured">Featured</span>
                          )}
                        </div>
                        <p className="muted">{trip.destination}</p>
                      </div>

                      <span className={`tripCalendarCard__status ${status.className}`}>
                        {status.label}
                      </span>
                    </div>

                    {trip.shortDescription && (
                      <p className="tripCalendarCard__description">
                        {trip.shortDescription}
                      </p>
                    )}

                    <div className="tripCalendarCard__meta">
                      <div>
                        <span className="muted">Start</span>
                        <strong>{formatDateTime(trip.startAt)}</strong>
                      </div>

                      <div>
                        <span className="muted">Slut</span>
                        <strong>{formatDateTime(trip.endAt)}</strong>
                      </div>

                      <div>
                        <span className="muted">Pris</span>
                        <strong>{formatPrice(trip.price)} kr</strong>
                      </div>

                      <div>
                        <span className="muted">Pladser</span>
                        <strong>{seatsLeft}</strong>
                      </div>
                    </div>

                    <div className="tripCalendarCard__actions">
                      <button
                        type="button"
                        onClick={() => onTripClick?.(trip)}
                        disabled={seatsLeft <= 0}
                      >
                        {seatsLeft <= 0 ? "Udsolgt" : "Se rejse"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}