import EffectChips from './EffectChips.jsx';

// One option (A, B or C) on the Challenge screen: title, text, cost chips,
// "Tomorrow" chip, shelter tag, and a Choose button.
export default function OptionCard({ letter, option, cid, sol, onChoose }) {
  const isRadiation = cid === 'R';
  const isLastSol = sol >= 3;

  return (
    <article className="card option-card">
      <h3 className="option-card__title">
        {letter}. {option.title}
      </h3>
      <p className="option-card__text">{option.text}</p>

      <div className="option-card__chips">
        <EffectChips effects={option.effects} />

        {/* Radiation: shelter only counts on Sol 1 or 2 (the red note covers Sol 3). */}
        {isRadiation && option.sheltered && !isLastSol && (
          <span className="option-card__tag is-safe">
            <span aria-hidden="true">☂</span> Crew is SHELTERED
          </span>
        )}
        {isRadiation && !option.sheltered && (
          <span className="option-card__tag is-warn">
            <span aria-hidden="true">⚠</span> Crew is NOT sheltered
          </span>
        )}
      </div>

      {option.later && (
        <p className="option-card__later">
          <span className="option-card__later-label">
            {isLastSol ? 'Arrives after the mission:' : 'Tomorrow:'}
          </span>{' '}
          <EffectChips effects={option.later} />
        </p>
      )}

      <button type="button" className="btn-primary option-card__choose" onClick={() => onChoose(letter)}>
        Choose {letter}
      </button>
    </article>
  );
}
