import { useEffect, useState } from "react";
import { api } from "../../../shared/api/api";
import { getCurrentUser } from "../../../auth/auth";
import type { Booking } from "../model/booking.types";
import type { Rejse } from "../../rejse/model/rejse.types";

type BookingWithTrip = Booking & {
    rejse?: Rejse | null;
};

export default function MineBookinger() {
    const currentUser = getCurrentUser();
    const [bookings, setBookings] = useState<BookingWithTrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    async function load() {
        setErr("");
        setLoading(true);

        try {
            const mine = await api.bookings.mine();

            const enriched = await Promise.all(
                mine.map(async (b) => {
                    try {
                        const rejse = await api.rejser.get(b.rejseId);
                        return { ...b, rejse };
                    } catch {
                        return { ...b, rejse: null };
                    }
                })
            );

            setBookings(enriched);
        } catch (e: any) {
            setErr(e?.message ?? "Kunne ikke hente bookinger.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCancel(bookingId: number) {
        const ok = window.confirm("Er du sikker på at du vil annullere bookingen?");
        if (!ok) return;

        setErr("");
        setCancellingId(bookingId);

        try {
            await api.bookings.cancel(bookingId);
            await load();
        } catch (e: any) {
            setErr(e?.message ?? "Kunne ikke annullere bookingen.");
        } finally {
            setCancellingId(null);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (!currentUser) {
        return (
            <div className="wrap">
                <section className="card">
                    <h1>Mine bookinger</h1>
                    <div className="error">Du skal være logget ind for at se dine bookinger.</div>
                </section>
            </div>
        );
    }

    return (
        <div className="wrap">
            <header className="header">
                <div>
                    <h1>Mine bookinger</h1>
                    <p className="muted">{currentUser.username}</p>
                </div>
                <button onClick={load} disabled={loading}>
                    Genindlæs
                </button>
            </header>

<br />

            {err && <div className="error">{err}</div>}

            <section className="card">
                {loading ? (
                    <p className="muted">Loader...</p>
                ) : bookings.length === 0 ? (
                    <p className="muted">Du har ingen bookinger endnu.</p>
                ) : (
                    <div className="table">
                        <div className="tr head mine-bookinger">
                            <div>Reference</div>
                            <div>Rejse</div>
                            <div>Destination</div>
                            <div>Start</div>
                            <div>Pladser</div>
                            <div>Status</div>
                            <div>Handling</div>
                        </div>

                        {bookings.map((b) => {
                            const isCancelled = b.status !== 0;

                            return (
                                <div
                                    className={`tr mine-bookinger ${isCancelled ? "cancelled" : ""}`}
                                    key={b.bookingId}
                                >
                                    <div>{b.bookingReference}</div>
                                    <div>{b.rejse?.title ?? `Rejse #${b.rejseId}`}</div>
                                    <div>{b.rejse?.destination ?? "-"}</div>
                                    <div>
                                        {b.rejse?.startAt
                                            ? new Date(b.rejse.startAt).toLocaleString()
                                            : "-"}
                                    </div>
                                    <div>{b.antalPladser}</div>
                                    <div className={isCancelled ? "status-cancelled" : "status-active"}>
                                        {isCancelled ? "Annulleret" : "Aktiv"}
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleCancel(b.bookingId)}
                                            disabled={isCancelled || cancellingId === b.bookingId}
                                        >
                                            {cancellingId === b.bookingId ? "Annullerer..." : "Annuller"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}