import { outcome } from '../game/game.js';
import '../styles/pixelscreens.css';
import { buildDebrief } from '../game/debrief.js';
import { CHALLENGES } from '../game/challenges.js';
import { useDonki, stormBadgeText } from '../components/useDonki.js';
import MeterPanel from '../components/MeterPanel.jsx';
import EffectChips from '../components/EffectChips.jsx';
import { commanderName } from '../components/commander.js';
import { ARRIVING_LABEL, STORM_SIZE, pickClassroomQuestions } from '../components/kidText.js';
import Icon from '../components/Icon.jsx';

// Screen 7 — Mission Debrief (docs/WIREFRAMES.md).
export default function Debrief({ state, go, actions }) {
  const result = outcome(state);
  const failed = result.key === 'failed';
  const { good, better, tip } = buildDebrief(state);
  const event = state.event;
  const donki = useDonki(event);

  const bySol = [1, 2, 3]
    .map((sol) => ({ sol, jobs: state.history.filter((h) => h.sol === sol) }))
    .filter((row) => row.jobs.length > 0);

  const arrivesAfter = state.phase === 'complete' ? state.pending : [];

  return (
    <main className="screen screen-debrief">
      <header className={`card debrief-header is-${result.key}`}>
        <h1 className="debrief-title">MISSION DEBRIEF</h1>
        <p className="debrief-name">{commanderName(state)}</p>
        <p className="debrief-result">{failed ? result.label.toUpperCase() : (<><Icon name="star" scale={1} /> {result.label.toUpperCase()} <Icon name="star" scale={1} /></>)}</p>
        {failed && (
          <p className="debrief-calm">
            {tip}
            <br />
            (Your final status and choices are below.)
          </p>
        )}
      </header>

      <h2 className="summary-heading summary-heading--outside">FINAL STATUS</h2>
      <MeterPanel state={state} final />

      <section className="card" aria-labelledby="deb-mission">
        <h2 id="deb-mission" className="summary-heading">YOUR MISSION</h2>
        <ul className="summary-list">
          {bySol.map(({ sol, jobs }) => (
            <li key={sol}>
              <strong>Sol {sol}:</strong>{' '}
              {jobs.map((h) => `${CHALLENGES[h.cid].title} (${h.opt})`).join(' · ')}
            </li>
          ))}
          {event && (
            <li>
              <strong>Storm:</strong> {STORM_SIZE[state.severity]} ·{' '}
              <span className="badge badge-real"><Icon name="globe" scale={1} /> {stormBadgeText(donki.origin)}</span> {event.classType} flare, {event.date}
            </li>
          )}
        </ul>
      </section>

      {(good.length > 0 || better.length > 0 || (!failed && tip)) && (
        <section className="card" aria-labelledby="deb-feedback">
          <h2 id="deb-feedback" className="summary-heading">HOW IT WENT</h2>
          {good.length > 0 && (
            <>
              <h3 className="debrief-sub">WHAT WENT WELL</h3>
              <ul className="summary-list">
                {good.map((line) => (
                  <li key={line} className="is-good">
                    <Icon name="check" scale={1} /> {line}
                  </li>
                ))}
              </ul>
            </>
          )}
          {better.length > 0 && (
            <>
              <h3 className="debrief-sub">WHAT TO IMPROVE</h3>
              <ul className="summary-list">
                {better.map((line) => (
                  <li key={line}>
                    <span aria-hidden="true">•</span> {line}
                  </li>
                ))}
              </ul>
            </>
          )}
          {!failed && tip && (
            <p className="debrief-tip">
              <strong>TIP:</strong> {tip}
            </p>
          )}
        </section>
      )}

      {arrivesAfter.length > 0 && (
        <section className="card" aria-labelledby="deb-after">
          <h2 id="deb-after" className="summary-heading">
            <Icon name="satellite" scale={1} /> ARRIVES AFTER THE MISSION
          </h2>
          <ul className="summary-list">
            {arrivesAfter.map((p, i) => (
              <li key={i}>
                {ARRIVING_LABEL[p.cid] ?? 'Arrival'}: <EffectChips effects={p.effects} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card" aria-labelledby="deb-think">
        <h2 id="deb-think" className="summary-heading">THINK ABOUT IT (class or family)</h2>
        <ol className="summary-list debrief-questions">
          {pickClassroomQuestions(state).map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </section>

      <p className="debrief-honesty">
        <span className="badge badge-game"><Icon name="die" scale={1} /> GAME NUMBERS</span> Game numbers are simplified.{' '}
        <span className="badge badge-real"><Icon name="globe" scale={1} /> REAL NASA</span> The storm is based on a real record.
      </p>

      <div className="summary-actions">
        <button type="button" className="btn-primary" onClick={actions.playAgain}>
          Play Again
        </button>
        <button type="button" onClick={() => go('sources')}>
          Sources
        </button>
        <button type="button" onClick={actions.restart}>
          Restart
        </button>
      </div>
    </main>
  );
}
