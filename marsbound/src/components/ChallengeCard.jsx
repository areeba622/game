// One challenge on the Dashboard: icon, title, one line, warning chip, done state.
export default function ChallengeCard({ icon, title, short, warning, doneOption, onSelect }) {
  const isDone = Boolean(doneOption);

  return (
    <article className={`challenge-card ${isDone ? 'is-done' : 'card'}`}>
      <h3 className="challenge-card__title">
        <span aria-hidden="true">{icon}</span> {title}
      </h3>
      <p className="challenge-card__short">{short}</p>

      {!isDone && warning && (
        <p className="challenge-card__warning">
          <span aria-hidden="true">⚠</span> {warning}
        </p>
      )}

      {isDone ? (
        <p className="challenge-card__done">
          <span aria-hidden="true">✓</span> DONE · Option {doneOption}
        </p>
      ) : (
        <button type="button" className="challenge-card__select" onClick={onSelect} aria-label={`Select ${title}`}>
          Select
        </button>
      )}
    </article>
  );
}
