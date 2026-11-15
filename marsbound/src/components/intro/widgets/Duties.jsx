import { DUTIES } from '../introScript.js';
import { Ico } from '../PixelKit.jsx';
import { Pill, Tile, WidgetFrame } from '../ui.jsx';

// Three duty cards. Tap each to reveal it.
export default function Duties({ w, patch, onNext }) {
  const open = (i) => patch((p) => ({ duties: p.duties.includes(i) ? p.duties : [...p.duties, i] }));
  return (
    <WidgetFrame done={w.duties.length === DUTIES.length} hint={`Tap all ${DUTIES.length} cards (${w.duties.length}/${DUTIES.length})`} onNext={onNext}>
      <div className="pi-tiles">
        {DUTIES.map((d, i) => (
          <Tile key={d[1]} selected={w.duties.includes(i)} ok={w.duties.includes(i)} onClick={() => open(i)} label={d[1]}>
            <Ico n={d[0]} s={8} />
            <Pill>{d[1]}</Pill>
            <span className="pi-card-text">{w.duties.includes(i) ? d[2] : <span className="pi-mut">Tap to reveal</span>}</span>
          </Tile>
        ))}
      </div>
    </WidgetFrame>
  );
}
