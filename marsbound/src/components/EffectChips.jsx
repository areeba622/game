import { METER_INFO } from './kidText.js';

// Chips for meter changes, e.g. { O: 20, W: -12 } → "🫧 +20  💧 −12".
// Gains are green with +, costs are orange with −; each chip has its meter icon.
export default function EffectChips({ effects }) {
  if (!effects) return null;

  return (
    <span className="effect-chips">
      {Object.entries(effects).map(([key, amount]) => {
        const gain = amount > 0;
        const info = METER_INFO[key];
        return (
          <span key={key} className={`effect-chip ${gain ? 'is-gain' : 'is-cost'}`}>
            <span aria-hidden="true">{info.icon}</span>
            <span className="sr-only">{info.label}</span> {gain ? '+' : '−'}
            {Math.abs(amount)}
          </span>
        );
      })}
    </span>
  );
}
