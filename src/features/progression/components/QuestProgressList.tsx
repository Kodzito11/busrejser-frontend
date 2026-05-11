import type { QuestProgressItem } from "../model/progression.types";

type Props = {
  quests: QuestProgressItem[];
};

function formatQuestStatus(status: QuestProgressItem["status"]) {
  if (status === "completed") return "Completed";
  if (status === "active") return "Active";
  return "Locked";
}

function getQuestStatusIcon(status: QuestProgressItem["status"]) {
  if (status === "completed") return "✅";
  if (status === "active") return "🟢";
  return "🔒";
}

export default function QuestProgressList({ quests }: Props) {
  if (quests.length === 0) {
    return <p className="muted">Ingen quests endnu.</p>;
  }

  return (
    <div className="progression-quest-grid">
      {quests.map((quest) => (
        <article
          key={quest.key}
          className={`progression-quest-card progression-quest-card--${quest.status}`}
        >
          <div className="progression-quest-card__top">
            <div>
              <p className="muted">Quest</p>
              <h3>{quest.title}</h3>
            </div>

            <span className={`progression-quest-card__status progression-quest-card__status--${quest.status}`}>
              {getQuestStatusIcon(quest.status)} {formatQuestStatus(quest.status)}
            </span>
          </div>

          <p className="muted">{quest.description}</p>

          <div className="progression-quest-card__progress">
            <strong>
              {quest.current} / {quest.target}
            </strong>
            <span className="muted">{quest.completionPercent}%</span>
          </div>

          <div className="progression-bar-card__track">
            <div
              className="progression-bar-card__fill"
              style={{ width: `${quest.completionPercent}%` }}
            />
          </div>

          <div className="progression-quest-card__reward">
            <span className="muted">Reward</span>
            <strong>{quest.rewardLabel}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}