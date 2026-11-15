import { endSol, newGame, statusLabel } from '../../../game/game.js';
import { Btn, Chip, Panel, SegBar, StatusLine, WidgetFrame } from '../ui.jsx';
import { STORM_SIZE } from '../../kidText.js';

// What does the storm do to Crew Health? Sheltered or not, for each size.
// The damage is NOT written in this file. It is worked out by running the real night
// (endSol) on a copy of a Sol 2 game for the chosen size, and comparing Crew Health.
const SIZES = [1, 2, 3];

function crewAfterNight(severity, sheltered) {
  const start = newGame(severity);
  return { before: start.C, after: endSol({ ...start, sol: 2, sheltered }).C };
}

export default function StormDemo({ w, patch, ctx, onNext }) {
  const size = w.size ?? ctx.severity;
  const sh = w.shelter;
  const safe = crewAfterNight(size, true);
  const hit = crewAfterNight(size, false);
  const damage = hit.before - hit.after;
  const hp = sh === false ? hit.after : safe.after;
  const { word } = statusLabel(hp);

  const choose = (value) => patch((p) => ({ shelter: value, tried: p.tried.includes(value) ? p.tried : [...p.tried, value] }));

  return (
    <WidgetFrame done={w.tried.length === 2} hint={`Try both: sheltered and not (${w.tried.length}/2)`} onNext={onNext}>
      <p className="pi-peach">1. THE CREW IS...</p>
      <div className="pi-row pi-block">
        <Btn cls={sh === true ? 'dark sel' : 'dark'} aria-pressed={sh === true} onClick={() => choose(true)}>
          Sheltered
        </Btn>
        <Btn cls={sh === false ? 'dark sel' : 'dark'} aria-pressed={sh === false} onClick={() => choose(false)}>
          Not sheltered
        </Btn>
      </div>
      <p className="pi-peach">2. STORM SIZE</p>
      <div className="pi-row pi-block">
        {SIZES.map((n) => (
          <Btn key={n} cls={size === n ? 'dark sel' : 'dark'} aria-pressed={size === n} onClick={() => patch({ size: n })}>
            {STORM_SIZE[n]}
          </Btn>
        ))}
      </div>
      <Panel cls="pi-detail dim">
        <span className="pi-peach">CREW HEALTH AFTER THE STORM</span>
        <SegBar value={hp} word={word} />
        <StatusLine value={hp} word={word} />
        {sh === null && <p className="pi-mut">Pick a situation above.</p>}
        {sh === true && <p className="pi-grn">Your crew was sheltered. No harm.</p>}
        {sh === false && <div className="pi-redbox">The storm hit! Crew Health −{damage}.</div>}
      </Panel>
      <div className="pi-chips">
        <Chip kind="game">GAME NUMBERS: damage is simplified</Chip>
      </div>
    </WidgetFrame>
  );
}
