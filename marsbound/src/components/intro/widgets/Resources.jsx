import { statusLabel } from '../../../game/game.js';
import { RESOURCES } from '../introScript.js';
import { Ico } from '../PixelKit.jsx';
import { METER_NAME } from '../pixelData.js';
import { Btn, Panel, Pill, SegBar, StatusLine, Tile, WidgetFrame } from '../ui.jsx';
import { SCIENCE_GOAL } from '../../kidText.js';

// The five resources. Tap each one, then try its practice bar: use some up, then refill.
// The status word comes from statusLabel() in the game rules.
export default function Resources({ w, patch, ctx, onNext }) {
  const k = w.resSel;
  const pick = (key) => patch((p) => ({ resSel: key, res: p.res.includes(key) ? p.res : [...p.res, key] }));
  const info = RESOURCES.find((r) => r[0] === k);
  const v = k ? w.demo[k] : 0;
  const setDemo = (value) => patch((p) => ({ demo: { ...p.demo, [k]: value } }));

  let detail = 'Tap a resource to learn about it.';
  if (info) {
    const science = k === 'S';
    const word = science ? (v >= SCIENCE_GOAL ? 'Healthy' : 'Low') : statusLabel(v).word;
    detail = (
      <>
        <span className="pi-peach">{METER_NAME[k].toUpperCase()}:</span> {info[1]}
        <br />
        <span className="pi-mut">{info[2]}</span>
        {science ? (
          <>
            <SegBar value={Math.min(100, (v / SCIENCE_GOAL) * 100)} word="Healthy" label={`${v} of ${SCIENCE_GOAL}`} />
            <div>
              {v} / {SCIENCE_GOAL} {v >= SCIENCE_GOAL ? 'GOAL REACHED!' : ''}
            </div>
            <div className="pi-row pi-top">
              <Btn cls="sm" onClick={() => setDemo(Math.min(SCIENCE_GOAL, v + 5))}>
                Run experiment
              </Btn>
              <Btn cls="sm dark" onClick={() => setDemo(0)}>
                Reset
              </Btn>
            </div>
          </>
        ) : (
          <>
            <SegBar value={v} word={word} />
            <StatusLine value={v} word={word} />
            {v <= 0 && <div className="pi-redbox">EMPTY: the mission would end!</div>}
            <div className="pi-row pi-top">
              <Btn cls="sm" onClick={() => setDemo(Math.max(0, v - 20))}>
                Use some
              </Btn>
              <Btn cls="sm dark" onClick={() => setDemo(ctx.start[k])}>
                Refill
              </Btn>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <WidgetFrame done={w.res.length === RESOURCES.length} hint={`Tap all ${RESOURCES.length} (${w.res.length}/${RESOURCES.length})`} onNext={onNext}>
      <div className="pi-tiles pi-tiles-sm">
        {RESOURCES.map((r) => (
          <Tile key={r[0]} selected={k === r[0]} ok={w.res.includes(r[0])} onClick={() => pick(r[0])} label={METER_NAME[r[0]]}>
            <Ico n={r[0]} s={8} />
            <Pill>{METER_NAME[r[0]].toUpperCase()}</Pill>
          </Tile>
        ))}
      </div>
      <Panel cls="pi-detail dim">{detail}</Panel>
    </WidgetFrame>
  );
}
