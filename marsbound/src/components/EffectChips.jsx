import { METER_INFO } from './kidText.js';

// Chips for meter changes, e.g. { O: 20, W: -12 } → "+20 OXYGEN  −12 WATER".
// Gains are green with +, costs are red with −. Words and signs carry the meaning, not colour alone.
export default function EffectChips({ effects }) {
  if (!effects) return null;

  return (
    <span className="effect-chips">
      {Object.entries(effects).map(([key, amount]) => {
        const gain = amount > 0;
        const info = METER_INFO[key];
        return (
          <span key={key} className={`effect-chip ${gain ? 'is-gain' : 'is-cost'}`}>
            {gain ? '+' : '−'}
            {Math.abs(amount)} {info.label.toUpperCase()}
          </span>
        );
      })}
    </span>
  );
}
