import { PLEDGES } from '../introScript.js';
import { Ico } from '../PixelKit.jsx';
import { Btn, WidgetFrame } from '../ui.jsx';

// The promises. All four must be ticked before Accept command unlocks.
export default function Accept({ w, patch, onAccept }) {
  const all = w.pledge.length === PLEDGES.length;
  const toggle = (i) => patch((p) => ({ pledge: p.pledge.includes(i) ? p.pledge.filter((x) => x !== i) : [...p.pledge, i] }));
  return (
    <WidgetFrame noNext>
      <p className="pi-peach pi-block">MY COMMANDER PROMISES</p>
      {PLEDGES.map((p, i) => {
        const on = w.pledge.includes(i);
        return (
          <button key={p} type="button" className={`pi-pnl pi-chk${on ? ' good' : ''}`} role="checkbox" aria-checked={on} onClick={() => toggle(i)}>
            <span className="pi-in">
              <span className="pi-bx">{on && <Ico n="check" s={3} />}</span>
              {p}
            </span>
          </button>
        );
      })}
      <div className="pi-row pi-c pi-top2">
        <Btn cls="big" disabled={!all} onClick={onAccept}>
          Accept command
        </Btn>
      </div>
      {!all && (
        <p className="pi-mut pi-center-text pi-top">
          Tick all {PLEDGES.length} promises to unlock ({w.pledge.length}/{PLEDGES.length})
        </p>
      )}
    </WidgetFrame>
  );
}
