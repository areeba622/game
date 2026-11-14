import ResourceBar from '../components/ResourceBar.jsx';
import StormForecast from '../components/StormForecast.jsx';
import ChallengeCard from '../components/ChallengeCard.jsx';
import MissionControl from '../components/MissionControl.jsx';
import MorningReport from '../components/MorningReport.jsx';
import { commanderName } from '../components/commander.js';
import { CHALLENGE_ORDER, CARD_TEXT, METERS } from '../components/kidText.js';
import { CHALLENGES } from '../game/challenges.js';

// Screen 4 — Dashboard (docs/WIREFRAMES.md).
// Jobs per Sol, mirrors CLAUDE.md 5.2. TODO: use an export from game.js if Person A adds one.
const JOBS_PER_SOL = { 1: 2, 2: 2, 3: 1 };
const JOBS_WORD = { 1: 'ONE CHALLENGE', 2: 'TWO CHALLENGES' };
const SCIENCE_GOAL = 15;

export default function Dashboard({ state, go, morningReport, actions }) {
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
          <button type="button" className="dash-header__restart" onClick={actions.restart}>
            Restart
          </button>
        </div>
        <p className="dash-header__commander">{commander}</p>
      </header>

      <MorningReport report={morningReport} state={state} onClose={actions.clearMorningReport} />

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
            const card = CARD_TEXT[id];
            // The storm chip is no longer true once the storm has passed (Sol 3).
            const warning = id === 'R' && state.sol >= 3 ? null : card.warning;
            return (
              <ChallengeCard
                key={id}
                icon={CHALLENGES[id].icon}
                title={CHALLENGES[id].title}
                short={card.short}
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
