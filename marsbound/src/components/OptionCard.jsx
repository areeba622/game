import EffectChips from './EffectChips.jsx';
import Icon from './Icon.jsx';

// One option (A, B or C) on the Challenge screen: title, text, cost chips,
// "Tomorrow" chip, shelter tag, and a Choose button.
export default function OptionCard({ letter, option, cid, sol, onChoose }) {
  const isRadiation = cid === 'R';
  const isLastSol = sol >= 3;

  return (
    <article className="pxw-opt pxw-panel">
      <div className="pxw-in">
        <span className="pxw-opt__letter" aria-hidden="true">
          {letter}
        </span>
        <h3 className="pxw-opt__title">{option.title}</h3>
        <p className="pxw-opt__text">{option.text}</p>

        <div className="pxw-opt__chips">
          <EffectChips effects={option.effects} />

          {/* Radiation: shelter only counts on Sol 1 or 2 (the red note covers Sol 3). */}
          {isRadiation && option.sheltered && !isLastSol && (
            <span className="pxw-tagline is-safe">
              <Icon name="shelter" scale={1} /> Crew is SHELTERED
            </span>
          )}
          {isRadiation && !option.sheltered && (
            <span className="pxw-tagline is-warn">
              <Icon name="warning" scale={1} /> Crew is NOT sheltered
            </span>
          )}
        </div>

        {option.later && (
          <p className="pxw-opt__later">
            <span className="pxw-opt__later-label">{isLastSol ? 'Arrives after the mission:' : 'Tomorrow:'}</span>{' '}
            <EffectChips effects={option.later} />
          </p>
        )}

        <button type="button" className="pxw-btn pxw-btn--go pxw-opt__choose" onClick={() => onChoose(letter)}>
          Choose {letter}
        </button>
      </div>
    </article>
  );
}
