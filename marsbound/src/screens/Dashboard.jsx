import { useState } from 'react';
import Modal from '../components/Modal.jsx';
import MeterPanel from '../components/MeterPanel.jsx';
import StormForecast from '../components/StormForecast.jsx';
import ChallengeCard from '../components/ChallengeCard.jsx';
import MissionControl from '../components/MissionControl.jsx';
import MorningReport from '../components/MorningReport.jsx';
import { commanderName } from '../components/commander.js';
import { CHALLENGE_ORDER, CARD_TEXT } from '../components/kidText.js';
import { CHALLENGES } from '../game/challenges.js';

// Screen 4 — Dashboard (docs/WIREFRAMES.md).
// Jobs per Sol, mirrors CLAUDE.md 5.2. TODO: use an export from game.js if Person A adds one.
const JOBS_PER_SOL = { 1: 2, 2: 2, 3: 1 };
const JOBS_WORD = { 1: 'ONE CHALLENGE', 2: 'TWO CHALLENGES' };

export default function Dashboard({ state, go, morningReport, actions }) {
  const [askRestart, setAskRestart] = useState(false);
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
          <button type="button" className="dash-header__restart" onClick={() => setAskRestart(true)}>
            Restart
          </button>
        </div>
        <p className="dash-header__commander">{commander}</p>
      </header>

      <MorningReport report={morningReport} state={state} onClose={actions.clearMorningReport} />

      <MeterPanel state={state} />

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

      {askRestart && (
        <Modal label="Start over?" onClose={() => setAskRestart(false)}>
          <h2 className="modal__title">Start over?</h2>
          <p>Your mission so far will be lost.</p>
          <div className="modal__actions">
            <button type="button" className="btn-primary" onClick={() => setAskRestart(false)}>
              Keep playing
            </button>
            <button type="button" onClick={actions.restart}>
              Yes, restart
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
