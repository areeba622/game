import Icon from './Icon.jsx';

const BADGE_ICON = { real: 'globe', game: 'die' };

// variant: warning | cost | gain | real | game | suggestion
// cost/gain: children must include the +/- sign; pass the meter icon name in `icon`.
// real/game: REAL NASA and GAME NUMBERS badges; the pixel icon is added for you.
// suggestion: a button (Nova, Comet, Orbit); `pressed` sets aria-pressed.
export default function Chip({ variant = 'warning', icon, pressed, onClick, className = '', children }) {
  const classes = `mb-chip mb-chip--${variant} ${className}`.trim();
  const iconName = icon ?? BADGE_ICON[variant];

  if (variant === 'suggestion') {
    return (
      <button type="button" className={classes} aria-pressed={Boolean(pressed)} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <span className={classes}>
      {iconName && <Icon name={iconName} />}
      {children}
    </span>
  );
}
