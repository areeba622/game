import { CHALLENGES } from '../game/challenges.js';
import EffectChips from './EffectChips.jsx';
import Icon from './Icon.jsx';
import { HARVEST_LINE, EARTH_REPLY_LINE } from './kidText.js';

// Dismissible card on the Dashboard: what arrived this morning
// (harvest / earthReply log entries from actions.startMorning()).
export default function MorningReport({ report, state, onClose }) {
  if (!report || report.length === 0) return null;

  const items = report
    .map((entry, i) => {
      if (entry.kind === 'harvest') {
        const later = CHALLENGES.G.options[state.done.G]?.later;
        return { key: i, icon: 'plant', text: HARVEST_LINE, effects: later };
      }
      if (entry.kind === 'earthReply') {
        return { key: i, icon: 'radio', text: EARTH_REPLY_LINE[state.done.M] ?? entry.text };
      }
      return null;
    })
    .filter(Boolean);

  if (items.length === 0) return null;

  return (
    <section className="morning-report pxw-morning pxw-panel" aria-labelledby="morning-title" aria-live="polite">
      <div className="pxw-in">
        <h2 id="morning-title" className="morning-report__title">
          <Icon name="sunrise" scale={2} /> MORNING REPORT · SOL {state.sol}
        </h2>
        <ul className="morning-report__list">
          {items.map((item) => (
            <li key={item.key}>
              <Icon name={item.icon} scale={2} /> {item.text} <EffectChips effects={item.effects} />
            </li>
          ))}
        </ul>
        <button type="button" className="pxw-btn pxw-btn--go" onClick={onClose}>
          Got it
        </button>
      </div>
    </section>
  );
}
