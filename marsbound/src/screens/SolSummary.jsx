import { CHALLENGES } from '../game/challenges.js';
import '../styles/pixelscreens.css';
import MeterPanel from '../components/MeterPanel.jsx';
import EffectChips from '../components/EffectChips.jsx';
import { commanderName } from '../components/commander.js';
import { ARRIVING_LABEL } from '../components/kidText.js';

const CHALLENGE_ICON = { L: 'life-support', R: 'radiation', W: 'power-budget', G: 'greenhouse', M: 'earth-signal' };
import Icon from '../components/Icon.jsx';

// Log text uses a plain hyphen for minus; show a real minus sign.
const prettyMinus = (text) => text.replace(/-(\d)/g, '−$1');

// Screen 6 — Sol Summary (docs/WIREFRAMES.md). Shown after the night.
// The button calls actions.startMorning(); this screen never dispatches or navigates itself.
export default function SolSummary({ state, actions }) {
  const sol = state.sol;
  const isLastSol = state.phase === 'complete';

  const didToday = state.history.filter((h) => h.sol === sol);
  const night = state.log.filter((e) => e.sol === sol && ['storm', 'upkeep', 'penalty'].includes(e.kind));
  const stormEntry = night.find((e) => e.kind === 'storm');
  const nightLines = night.filter((e) => e.kind !== 'storm');

  let stormLine = null;
  if (sol === 1) {
    stormLine = (
      <>
        <Icon name="sun" scale={1} /> Storm: not yet. It comes at the end of Sol 2.
      </>
    );
  } else if (sol === 2) {
    stormLine = stormEntry ? (
      <>
        <Icon name="storm" scale={1} /> {prettyMinus(stormEntry.text)}
      </>
    ) : (
      <>
        <Icon name="shelter" scale={1} /> Your crew was sheltered. No harm.
      </>
    );
  }

  return (
    <main className="screen screen-sol-summary">
      <header className="card summary-header">
        <h1 className="summary-title">SOL {sol} COMPLETE</h1>
        <p className="summary-sub">Great work, {commanderName(state)}.</p>
      </header>

      <section className="card" aria-labelledby="sum-did">
        <h2 id="sum-did" className="summary-heading">TODAY YOU DID</h2>
        <ul className="summary-list">
          {didToday.map((h) => (
            <li key={h.cid}>
              <Icon name={CHALLENGE_ICON[h.cid]} scale={1} /> {CHALLENGES[h.cid].title}: {h.opt}.{' '}
              {CHALLENGES[h.cid].options[h.opt].title}
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="sum-night">
        <h2 id="sum-night" className="summary-heading">TONIGHT</h2>
        <ul className="summary-list">
          {nightLines.map((e, i) => (
            <li key={i}>
              <Icon name={e.kind === 'upkeep' ? 'moon' : 'warning'} scale={1} /> {prettyMinus(e.text)}
            </li>
          ))}
          {stormLine && <li className={stormEntry ? 'is-bad' : ''}>{stormLine}</li>}
        </ul>
      </section>

      <h2 className="summary-heading summary-heading--outside">METERS NOW</h2>
      <MeterPanel state={state} />

      {state.pending.length > 0 && (
        <section className="card" aria-labelledby="sum-arriving">
          <h2 id="sum-arriving" className="summary-heading">
            <Icon name="hourglass" scale={1} /> {isLastSol ? 'ARRIVES AFTER THE MISSION' : 'ARRIVING TOMORROW'}
          </h2>
          <ul className="summary-list">
            {state.pending.map((p, i) => (
              <li key={i}>
                {ARRIVING_LABEL[p.cid] ?? 'Arrival'}: <EffectChips effects={p.effects} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="summary-actions">
        <button type="button" className="btn-primary" onClick={actions.startMorning}>
          {isLastSol ? 'See Mission Debrief' : `Start Sol ${sol + 1}`}
        </button>
      </div>
    </main>
  );
}
