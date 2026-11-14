import { CHALLENGES } from '../game/challenges.js';
import EffectChips from './EffectChips.jsx';
import { HARVEST_LINE, EARTH_REPLY_LINE } from './kidText.js';

// Dismissible card on the Dashboard: what arrived this morning
// (harvest / earthReply log entries from actions.startMorning()).
export default function MorningReport({ report, state, onClose }) {
  if (!report || report.length === 0) return null;

  const items = report
    .map((entry, i) => {
      if (entry.kind === 'harvest') {
        const later = CHALLENGES.G.options[state.done.G]?.later;
        return { key: i, icon: '🌱', text: HARVEST_LINE, effects: later };
      }
      if (entry.kind === 'earthReply') {
        return { key: i, icon: '📡', text: EARTH_REPLY_LINE[state.done.M] ?? entry.text };
      }
      return null;
    })
    .filter(Boolean);

  if (items.length === 0) return null;

  return (
    <section className="card morning-report" aria-labelledby="morning-title" aria-live="polite">
      <h2 id="morning-title" className="morning-report__title">
        <span aria-hidden="true">🌅</span> MORNING REPORT · SOL {state.sol}
      </h2>
      <ul className="morning-report__list">
        {items.map((item) => (
          <li key={item.key}>
            <span aria-hidden="true">{item.icon}</span> {item.text} <EffectChips effects={item.effects} />
          </li>
        ))}
      </ul>
      <button type="button" onClick={onClose}>
        Got it
      </button>
    </section>
  );
}
