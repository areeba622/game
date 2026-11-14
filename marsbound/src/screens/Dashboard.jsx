import ResourceBar from '../components/ResourceBar.jsx';
import StormForecast from '../components/StormForecast.jsx';
import ChallengeCard from '../components/ChallengeCard.jsx';
import MissionControl from '../components/MissionControl.jsx';
import { commanderName } from '../components/commander.js';
import { CHALLENGE_ORDER, CHALLENGE_TEXT, METERS } from '../components/kidText.js';

// Screen 4 — Dashboard (docs/WIREFRAMES.md).
// Jobs per Sol, mirrors CLAUDE.md 5.2. TODO: use an export from game.js if Person A adds one.
const JOBS_PER_SOL = { 1: 2, 2: 2, 3: 1 };
const JOBS_WORD = { 1: 'ONE CHALLENGE', 2: 'TWO CHALLENGES' };
const SCIENCE_GOAL = 15;

export default function Dashboard({ state, go }) {
  const quota = JOBS_PER_SOL[state.sol];
  const commander = commanderName(state);

  return (
    <main className="screen screen-dashboard">
      <header className="dash-header card">
        <div className="dash-header__row">
          <span className="dash-header__name">MARSBOUND</span>
          <span className="dash-header__sol">SOL {state.sol} of 3</span>
          <span className="dash-header__jobs">
            Jobs today: {state.doneThisSol}/{quota}
          </span>
          {/* TODO: switch to actions.restart() once Person A adds `actions`. */}
          <button type="button" className="dash-header__restart" onClick={() => go('callsign')}>
            Restart
          </button>
        </div>
        <p className="dash-header__commander">{commander}</p>
      </header>

      <section className="dash-meters" aria-label="Resources">
        {METERS.map((m) => (
          <ResourceBar key={m.key} label={m.label} icon={m.icon} value={state[m.key]} />
        ))}
        <div className={`science ${state.S >= SCIENCE_GOAL ? 'is-met' : ''}`}>
          <span className="science__label">
            <span aria-hidden="true">🔬</span> SCIENCE
          </span>
          <span className="science__value">{state.S}</span>
          <span className="science__goal">
            goal: {SCIENCE_GOAL}
            {state.S >= SCIENCE_GOAL && ' ✓'}
          </span>
        </div>
      </section>

      <StormForecast state={state} />

      <section className="dash-challenges" aria-labelledby="dash-challenges-title">
        <h2 id="dash-challenges-title" className="dash-challenges__title">
          CHOOSE {JOBS_WORD[quota]} TODAY
        </h2>
        <div className="dash-challenges__grid">
          {CHALLENGE_ORDER.map((id) => {
            const text = CHALLENGE_TEXT[id];
            // The storm chip is no longer true once the storm has passed (Sol 3).
            const warning = id === 'R' && state.sol >= 3 ? null : text.warning;
            return (
              <ChallengeCard
                key={id}
                icon={text.icon}
                title={text.title}
                short={text.short}
                warning={warning}
                doneOption={state.done[id]}
                onSelect={() => go('challenge', id)}
              />
            );
          })}
        </div>
      </section>

      <MissionControl state={state} />
    </main>
  );
}
