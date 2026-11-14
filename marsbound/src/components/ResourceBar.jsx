import { statusLabel } from '../game/game.js';

// One meter: icon + label, number, a pressed track with a fill, and the
// status as word + colour + icon (never colour alone).
// The colour comes from CSS (class from the status word), not from statusLabel().color.
export default function ResourceBar({ label, icon, value }) {
  const { word, icon: statusIcon } = statusLabel(value);
  const width = Math.max(0, Math.min(100, value));
  const statusClass = `status-${word.toLowerCase()}`;

  return (
    <div className={`resource-bar ${statusClass}`}>
      <span className="resource-bar__label">
        <span aria-hidden="true">{icon}</span> {label}
      </span>
      <span className="resource-bar__value">{value}</span>
      <div
        className="resource-bar__track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value}, ${word}`}
      >
        <div className="resource-bar__fill" style={{ width: `${width}%` }} />
      </div>
      <span className="resource-bar__status status-word">
        <span className="status-icon" aria-hidden="true">{statusIcon}</span>
        {word}
      </span>
    </div>
  );
}
