import Icon from './Icon.jsx';

// One meter: icon + label, a stepped fill (steps of 5), the value in the stat font beside the track,
// and the status as icon + word chip. `word` is Healthy | OK | Low | Critical | Empty.
export default function MeterBar({ label, icon, value, word }) {
  const status = word.toLowerCase();
  const clamped = Math.max(0, Math.min(100, value));
  const filled = clamped === 0 ? 0 : Math.min(100, Math.ceil(clamped / 5) * 5);

  return (
    <div className="mb-meter-box">
      <div className={`mb-meter mb-meter--${status}`}>
        <span className={`mb-meter__label${label === 'Water' ? ' mb-meter__label--water' : ''}`}>
          {icon && <Icon name={icon} />}
          {label}
        </span>
        <span className="mb-meter__value">{value}</span>
        <div
          className="mb-meter__track"
          role="meter"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={`${value}, ${word}`}
        >
          <div className="mb-meter__fill" style={{ '--mb-fill': `${filled}%` }} />
        </div>
        <span className={`mb-status mb-status--${status}`}>
          <Icon name={`status-${status}`} />
          <span className="mb-status__word">{word}</span>
        </span>
      </div>
    </div>
  );
}
