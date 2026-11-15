import { Ico } from './PixelKit.jsx';
import { METER_NAME, statusLook } from './pixelData.js';

// Small building blocks shared by the Intro components. All classes start with "pi-" so they
// can never collide with the rest of the app's styles.

export const Panel = ({ cls = '', as: Tag = 'div', children, ...rest }) => (
  <Tag className={`pi-pnl ${cls}`.trim()} {...rest}>
    <span className="pi-in">{children}</span>
  </Tag>
);

export const Btn = ({ cls = '', children, type = 'button', ...rest }) => (
  <button type={type} className={`pi-btn ${cls}`.trim()} {...rest}>
    <span>{children}</span>
  </button>
);

export const Chip = ({ kind = '', icon, children }) => (
  <span className={`pi-chip ${kind}`.trim()}>
    <span>
      {icon && <Ico n={icon} s={2} />}
      {children}
    </span>
  </span>
);

export const Pill = ({ children }) => (
  <span className="pi-pill">
    <span>{children}</span>
  </span>
);

// A segmented bar, 20 cells, coloured by the status word.
export function SegBar({ value, word, label }) {
  const on = Math.round(value / 5);
  const { color } = statusLook(word);
  return (
    <div className="pi-seg20" role="img" aria-label={label ?? `${value} of 100`}>
      {Array.from({ length: 20 }, (_, i) => (
        <i key={i} style={i < on ? { background: color } : undefined} />
      ))}
    </div>
  );
}

// Word + icon + number for one status, so colour is never the only signal.
export function StatusLine({ value, word }) {
  const look = statusLook(word);
  return (
    <div className="pi-row pi-tight">
      <Ico n={look.icon} s={3} />
      <b className="pi-statusword" style={{ color: look.color }}>
        {word.toUpperCase()}
      </b>
      <span>{value}</span>
    </div>
  );
}

// Effect chips for { O: 20, W: -12 } and an optional "tomorrow" chip from `later`.
export function FxChips({ effects, later }) {
  const keys = ['O', 'W', 'P', 'C', 'S'];
  const fx = effects ?? {};
  const lt = later ?? null;
  return (
    <div className="pi-chips">
      {keys
        .filter((k) => fx[k])
        .map((k) => (
          <Chip key={k} kind={fx[k] > 0 ? '' : 'cost'} icon={k}>
            {fx[k] > 0 ? '+' : '−'}
            {Math.abs(fx[k])} {METER_NAME[k].toUpperCase()}
          </Chip>
        ))}
      {lt && (
        <Chip kind="info">
          TOMORROW:{' '}
          {['O', 'W', 'P', 'C']
            .filter((k) => lt[k])
            .map((k) => `${lt[k] > 0 ? '+' : '−'}${Math.abs(lt[k])} ${METER_NAME[k]}`)
            .join(', ')}
        </Chip>
      )}
    </div>
  );
}

// A tappable tile. `ok` shows the visited tick. aria-pressed marks the one being read.
export function Tile({ selected, ok, onClick, children, label }) {
  return (
    <button
      type="button"
      className={`pi-pnl pi-tile${selected ? ' sel' : ''}`}
      aria-pressed={!!selected}
      aria-label={label}
      onClick={onClick}
    >
      {ok && (
        <span className="pi-ok">
          <Ico n="check" s={3} />
        </span>
      )}
      <span className="pi-in">{children}</span>
    </button>
  );
}

// The frame every widget sits in: its content, a hint, and a Continue button that stays
// disabled until the widget says it is done.
export function WidgetFrame({ done, hint, onNext, noNext, children }) {
  return (
    <>
      <Panel cls="pi-w">{children}</Panel>
      {!noNext && (
        <div className="pi-act">
          <span className="pi-hint" aria-live="polite">
            {done ? 'ALL DONE!' : hint}
          </span>
          <Btn disabled={!done} onClick={onNext}>
            Continue ▸
          </Btn>
        </div>
      )}
    </>
  );
}
