import { useState } from 'react';
import { CHALLENGES } from '../game/challenges.js';
import { statusLabel } from '../game/game.js';
import OptionCard from '../components/OptionCard.jsx';
import NasaDrawer from '../components/NasaDrawer.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import ResultModal from '../components/ResultModal.jsx';
import { METERS, METER_INFO } from '../components/kidText.js';

// Screen 5 — Challenge (docs/WIREFRAMES.md): situation, 3 options, NASA drawer.
export default function Challenge({ state, dispatch, go, selectedChallenge, actions }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chosen, setChosen] = useState(null); // option letter waiting for Confirm
  const [step, setStep] = useState(null); // null | 'confirm' | 'result'

  const cid = selectedChallenge;
  const challenge = CHALLENGES[cid];

  if (!challenge) {
    return (
      <main className="screen">
        <button type="button" onClick={() => go('dashboard')}>
          ← Back
        </button>
      </main>
    );
  }

  const isLastSol = state.sol >= 3;
  const hasLater = Object.values(challenge.options).some((o) => o.later);

  function handleChoose(letter) {
    setChosen(letter);
    setStep('confirm');
  }

  function handleConfirm() {
    dispatch({ type: 'CHOOSE', cid, opt: chosen });
    setStep('result');
  }

  return (
    <main className="screen screen-challenge">
      <header className="challenge-header card">
        <button type="button" onClick={() => go('dashboard')}>
          ← Back
        </button>
        <h1 className="challenge-header__title">
          <span aria-hidden="true">{challenge.icon}</span> {challenge.title.toUpperCase()}
        </h1>
        <span className="challenge-header__sol">SOL {state.sol}</span>
      </header>

      {isLastSol && cid === 'R' && (
        <p className="warning-danger">
          <span aria-hidden="true">⚠</span> The storm already passed. Shelter will not help now.
        </p>
      )}
      {isLastSol && hasLater && (
        <p className="warning-danger">
          <span aria-hidden="true">⚠</span> This reward arrives after the mission ends.
        </p>
      )}

      <section className="card challenge-situation">
        <p className="challenge-situation__intro">{challenge.intro}</p>
        <div className="now-meters" aria-label="Meters now">
          <span className="now-meters__label">Now:</span>
          {METERS.map((m) => {
            const status = statusLabel(state[m.key]);
            return (
              <span key={m.key} className={`now-meter status-${status.word.toLowerCase()}`}>
                <span aria-hidden="true">{m.icon}</span>
                <span className="sr-only">{m.label}</span> {state[m.key]}{' '}
                <span className="status-word">
                  <span className="status-icon" aria-hidden="true">{status.icon}</span>
                  {status.word}
                </span>
              </span>
            );
          })}
          <span className="now-meter">
            <span aria-hidden="true">{METER_INFO.S.icon}</span>
            <span className="sr-only">{METER_INFO.S.label}</span> {state.S}
          </span>
        </div>
      </section>

      <section className="challenge-options" aria-label="Options">
        {['A', 'B', 'C'].map((letter) => (
          <OptionCard
            key={letter}
            letter={letter}
            option={challenge.options[letter]}
            cid={cid}
            sol={state.sol}
            onChoose={handleChoose}
          />
        ))}
      </section>

      <section className="challenge-nasa">
        <button
          type="button"
          aria-expanded={drawerOpen}
          aria-controls="nasa-drawer-slot"
          onClick={() => setDrawerOpen((open) => !open)}
        >
          <span aria-hidden="true">🛰</span> How NASA handles this {drawerOpen ? '▲' : '▼'}
        </button>
        <div id="nasa-drawer-slot">
          {drawerOpen && <NasaDrawer challengeId={cid} onClose={() => setDrawerOpen(false)} />}
        </div>
      </section>

      {step === 'confirm' && (
        <ConfirmModal
          state={state}
          cid={cid}
          opt={chosen}
          onConfirm={handleConfirm}
          onCancel={() => setStep(null)}
        />
      )}
      {step === 'result' && (
        <ResultModal state={state} cid={cid} opt={chosen} onContinue={actions.continueAfterResult} />
      )}
    </main>
  );
}
