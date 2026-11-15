import { CREW } from '../introScript.js';
import { Portrait } from '../PixelKit.jsx';
import { Panel, Pill, Tile, WidgetFrame } from '../ui.jsx';

// Four astronauts. Tap each one to hear them.
export default function Crew({ w, patch, ctx, onNext }) {
  const sel = w.crewSel !== null ? CREW[w.crewSel] : null;
  const pick = (i) => patch((p) => ({ crewSel: i, crew: p.crew.includes(i) ? p.crew : [...p.crew, i] }));
  return (
    <WidgetFrame done={w.crew.length === CREW.length} hint={`Say hello to everyone (${w.crew.length}/${CREW.length})`} onNext={onNext}>
      <div className="pi-tiles">
        {CREW.map((c, i) => (
          <Tile key={c[0]} selected={w.crewSel === i} ok={w.crew.includes(i)} onClick={() => pick(i)} label={`${c[1]}, ${c[2]}`}>
            <div className="pi-pc pi-flat">
              <Portrait who={c[0]} />
            </div>
            <Pill>{c[1]}</Pill>
            <span className="pi-mut pi-small">{c[2].toUpperCase()}</span>
          </Tile>
        ))}
      </div>
      <Panel cls="pi-detail dim">
        {sel ? (
          <>
            <span className="pi-peach">{sel[1].toUpperCase()}:</span> “{ctx.fill(sel[3])}”
          </>
        ) : (
          'Tap an astronaut to hear them.'
        )}
      </Panel>
    </WidgetFrame>
  );
}
