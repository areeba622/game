import { SOLS } from '../introScript.js';
import { Ico } from '../PixelKit.jsx';
import { Panel, Pill, Tile, WidgetFrame } from '../ui.jsx';

// Three Sols. Each little box is one job.
export default function Sols({ w, patch, onNext }) {
  const k = w.solSel;
  const open = (i) => patch((p) => ({ solSel: i, sols: p.sols.includes(i) ? p.sols : [...p.sols, i] }));
  return (
    <WidgetFrame done={w.sols.length === SOLS.length} hint={`Open all ${SOLS.length} Sols (${w.sols.length}/${SOLS.length})`} onNext={onNext}>
      <div className="pi-tiles">
        {SOLS.map((s, i) => (
          <Tile key={s[0]} selected={k === i} ok={w.sols.includes(i)} onClick={() => open(i)} label={s[0]}>
            <Ico n={s[3]} s={8} />
            <Pill>{s[0]}</Pill>
            <div className="pi-slots">
              {Array.from({ length: s[1] }, (_, j) => (
                <i key={j} className={`pi-sq${w.sols.includes(i) ? ' done' : ''}`} />
              ))}
            </div>
          </Tile>
        ))}
      </div>
      <Panel cls="pi-detail dim">
        {k !== null ? (
          <>
            <span className="pi-peach">{SOLS[k][0].toUpperCase()}:</span> {SOLS[k][1]} job{SOLS[k][1] > 1 ? 's' : ''}. {SOLS[k][2]}
          </>
        ) : (
          'Tap a Sol. Each box is one job.'
        )}
      </Panel>
    </WidgetFrame>
  );
}
