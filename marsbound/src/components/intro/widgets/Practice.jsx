import { CHALLENGES } from '../../../game/challenges.js';
import { previewChoice, statusLabel } from '../../../game/game.js';
import { PRACTICE_OPTIONS, PRACTICE_FEEDBACK } from '../introScript.js';
import { METER_NAME } from '../pixelData.js';
import { Btn, FxChips, Panel, WidgetFrame } from '../ui.jsx';

// One practice decision, with the same NOW -> AFTER table the real Confirm pop-up shows.
// `ctx.practice` is a throwaway copy of the game with Oxygen and Power low. It is never
// changed: previewChoice() only reads it and returns what would happen.
const KEYS = ['O', 'W', 'P', 'C', 'S'];
const idOf = (cid, opt) => `${cid}-${opt}`;

export default function Practice({ w, patch, ctx, onNext, onFeedback }) {
  const { practice } = ctx;
  const sel = w.prac ? PRACTICE_OPTIONS.find(([cid, opt]) => idOf(cid, opt) === w.prac) : null;
  const preview = sel ? previewChoice(practice, sel[0], sel[1]) : null;
  const chosenOpt = sel ? CHALLENGES[sel[0]].options[sel[1]] : null;

  let body;
  if (!w.pracDone) {
    body = (
      <>
        <div className="pi-opts" role="group" aria-label="Practice options">
          {PRACTICE_OPTIONS.map(([cid, opt]) => {
            const o = CHALLENGES[cid].options[opt];
            const id = idOf(cid, opt);
            return (
              <Btn key={id} cls={`dark wide${w.prac === id ? ' sel' : ''}`} aria-pressed={w.prac === id} onClick={() => patch({ prac: id })}>
                <span className="pi-col">
                  {CHALLENGES[cid].title}: {o.title}
                  <FxChips effects={o.effects} />
                </span>
              </Btn>
            );
          })}
        </div>
        {preview ? (
          <Panel cls="pi-detail dim">
            <span className="pi-peach">
              YOU SELECTED: {sel[1]}. {chosenOpt.title.toUpperCase()}
            </span>
            <table className="pi-tab">
              <caption className="pi-sr">Meters before and after this choice</caption>
              <thead>
                <tr>
                  <th scope="col">Meter</th>
                  <th scope="col" className="r">
                    NOW
                  </th>
                  <th scope="col" className="r">
                    {preview.includesNight ? 'AFTER TONIGHT' : 'AFTER'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {KEYS.map((k) => {
                  const now = practice[k];
                  const after = preview.after[k];
                  const changed = now !== after;
                  const wordChanged = k !== 'S' && statusLabel(now).word !== statusLabel(after).word;
                  return (
                    <tr key={k} className={changed ? 'chg' : ''}>
                      <th scope="row">{METER_NAME[k]}</th>
                      <td className="v">{now}</td>
                      <td className="v">
                        {changed ? '> ' : ''}
                        {after}
                        {wordChanged && <span className="pi-mut pi-small"> ({statusLabel(after).word})</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {preview.failed && <div className="pi-redbox">CAREFUL! If you choose this, the mission ends.</div>}
            <div className="pi-row">
              <Btn
                onClick={() => {
                  patch({ pracDone: true });
                  onFeedback(PRACTICE_FEEDBACK[w.prac]);
                }}
              >
                Confirm
              </Btn>
              <Btn cls="dark" onClick={() => patch({ prac: null })}>
                Change choice
              </Btn>
            </div>
          </Panel>
        ) : (
          <Panel cls="pi-detail dim">Choose an option to preview what will happen.</Panel>
        )}
      </>
    );
  } else {
    body = (
      <Panel cls="pi-detail dim">
        <span className="pi-grn">
          YOU CHOSE {sel[1]}. {chosenOpt.title.toUpperCase()}
        </span>
        <FxChips effects={chosenOpt.effects} />
      </Panel>
    );
  }

  return (
    <WidgetFrame done={w.pracDone} hint="Pick an option and confirm" onNext={onNext} noNext={!w.pracDone}>
      <p className="pi-block">
        <span className="pi-peach">RIGHT NOW:</span> {['O', 'P', 'W', 'C'].map((k) => `${METER_NAME[k]} ${practice[k]}`).join('  |  ')}
      </p>
      {body}
    </WidgetFrame>
  );
}
