import type { RegionProgressItem } from "../model/progression.types";

type Props = {
    regions: RegionProgressItem[];
};

export default function RegionProgressList({ regions }: Props) {
    if (regions.length === 0) {
        return <p className="muted">Ingen regioner besøgt endnu.</p>;
    }

    return (
        <div className="region-progress-list">
            {regions.map((region) => (
                <article
                    key={`${region.country}-${region.region}`}
                    className="region-progress-card"
                >
                    <div>
                        <h3>{region.region}</h3>
                        <p className="muted">{region.country}</p>
                    </div>

                    <div className="region-progress-card__stats">
                        <strong>{region.visitedLocationCount}</strong>
                        <span>destinationer</span>
                    </div>

                    <p className="muted">
                        {region.totalVisitCount === 1
                            ? "Besøgt 1 gang"
                            : `Besøgt ${region.totalVisitCount} gange`}
                    </p>
                </article>
            ))}
        </div>
    );
}