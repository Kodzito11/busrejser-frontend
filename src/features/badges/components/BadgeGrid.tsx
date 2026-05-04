import type { Badge, UserBadge } from "../model/badge.types";

type Props = {
  allBadges: Badge[];
  earnedBadges: UserBadge[];
};

export default function BadgeGrid({ allBadges, earnedBadges }: Props) {
  const earnedById = new Map(earnedBadges.map((b) => [b.badgeId, b]));

  return (
    <div className="badge-grid">
      {allBadges.map((badge) => {
        const earned = earnedById.get(badge.badgeId);
        const isEarned = Boolean(earned);

        return (
          <article
            key={badge.badgeId}
            className={`badge-card ${
              isEarned ? "badge-card--earned" : "badge-card--locked"
            }`}
          >
            <div className="badge-card__icon">{isEarned ? "🏆" : "🔒"}</div>

            <div>
              <div className="badge-card__top">
                <h3>{badge.name}</h3>
                <span
                  className={`badge-tier badge-tier--${badge.tier.toLowerCase()}`}
                >
                  {badge.tier}
                </span>
              </div>

              <p className="muted">{badge.description}</p>

              {isEarned ? (
                <p className="badge-card__earned">
                  Optjent{" "}
                  {new Date(earned!.earnedAt).toLocaleDateString("da-DK")}
                </p>
              ) : (
                <p className="badge-card__locked">Ikke optjent endnu</p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}