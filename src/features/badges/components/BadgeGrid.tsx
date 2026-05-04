import type { Badge, UserBadge } from "../model/badge.types";

type Props = {
  allBadges: Badge[];
  earnedBadges: UserBadge[];
};

function getBadgeIcon(tier: string, isEarned: boolean) {
  if (!isEarned) return "🔒";

  switch (tier.toLowerCase()) {
    case "bronze":
      return "🥉";
    case "silver":
      return "🥈";
    case "gold":
      return "🥇";
    case "platinum":
      return "💎";
    default:
      return "🏆";
  }
}

export default function BadgeGrid({ allBadges, earnedBadges }: Props) {
  const earnedById = new Map(earnedBadges.map((b) => [b.badgeId, b]));

  if (allBadges.length === 0) {
    return <p className="muted">Der er ingen badges endnu.</p>;
  }

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
            <div className="badge-card__icon">
              {getBadgeIcon(badge.tier, isEarned)}
            </div>

            <div className="badge-card__content">
              <div className="badge-card__top">
                <h3>{badge.name}</h3>

                <span
                  className={`badge-tier badge-tier--${badge.tier.toLowerCase()}`}
                >
                  {badge.tier}
                </span>
              </div>

              <p className="badge-card__description">{badge.description}</p>

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