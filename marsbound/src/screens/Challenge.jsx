import { useRef, useState } from 'react';
import { CHALLENGES } from '../game/challenges.js';
import OptionCard from '../components/OptionCard.jsx';
import NasaDrawer from '../components/NasaDrawer.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import ResultModal from '../components/ResultModal.jsx';
import PixelWorld from '../components/PixelWorld.jsx';
import PxMeters from '../components/PxMeters.jsx';
import Typewriter from '../components/Typewriter.jsx';
import MissionPortrait from '../components/MissionPortrait.jsx';
import Icon from '../components/Icon.jsx';
import '../styles/pixelworld.css';

// Screen 5 — Challenge (docs/WIREFRAMES.md): situation, 3 options, NASA drawer.
// One column, top to bottom: HUD, the pixel scene, Mission Control's message, the meters,
// the three options, the NASA button. Nothing overlaps; the page scrolls if it must.
// Game rules are untouched: Choose -> Confirm pop-up -> dispatch CHOOSE -> Result pop-up -> Continue.

// Which pixel scene belongs to which challenge.
const SCENE_OF = { L: 'life', R: 'rad', W: 'power', G: 'green', M: 'msg' };

// How the scene should look after a choice. Display only: it reads the option's numbers,
// it never changes them. A shelter option, or a net gain, plays the happy scene.
function toneOf(cid, opt) {
  const option = CHALLENGES[cid].options[opt];
  if (cid === 'R') return option.sheltered ? 'good' : 'bad';
  const sum = (obj) => Object.values(obj ?? {}).reduce((a, b) => a + b, 0);
  const net = sum(option.effects) + sum(option.later);
  return net >= 3 ? 'good' : net <= -3 ? 'bad' : 'mid';
}

export default function Challenge({ state, dispatch, go, selectedChallenge, actions }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chosen, setChosen] = useState(null); // option letter waiting for Confirm
  const [step, setStep] = useState(null); // null | 'confirm' | 'result'
  const [geo, setGeo] = useState(null);
  const hudRef = useRef(null);
  const bodyRef = useRef(null);

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

  const tone = step === 'result' && chosen ? toneOf(cid, chosen) : 'intro';

  return (
    <main className="pxw pxw-story px">
      <PixelWorld
        view="story"
        phase={state.sol - 1}
        values={{}}
        storyId={SCENE_OF[cid]}
        res={tone}
        hudRef={hudRef}
        footRef={bodyRef}
        onLayout={setGeo}
      />

      <header className="pxw-hud pxw-hud--slim pxw-panel" ref={hudRef}>
        <div className="pxw-in">
          <div className="pxw-hud__top">
            <button type="button" className="pxw-btn pxw-btn--small" onClick={() => go('dashboard')}>
              <Icon name="arrow-left" scale={1} /> Back
            </button>
            <b className="pxw-sol">SOL {state.sol} / 3</b>
            <h1 className="pxw-title">{challenge.title}</h1>
          </div>
        </div>
      </header>

      {/* The scene is drawn on the canvas behind; this spacer keeps the content below it. */}
      <div className="pxw-stage" style={{ height: geo?.stageH ?? 0 }} aria-hidden="true" />

      <div className="pxw-body" ref={bodyRef}>
        {isLastSol && cid === 'R' && (
          <p className="pxw-alert" role="note">
            <Icon name="warning" scale={1} /> The storm already passed. Shelter will not help now.
          </p>
        )}
        {isLastSol && hasLater && (
          <p className="pxw-alert" role="note">
            <Icon name="warning" scale={1} /> This reward arrives after the mission ends.
          </p>
        )}

        <div className="pxw-dialogue pxw-panel">
          <div className="pxw-in">
            <div className="pxw-who">
              <MissionPortrait />
              <span>MISSION CONTROL</span>
            </div>
            <Typewriter key={cid} text={challenge.intro} className="pxw-line" />
          </div>
        </div>

        <section className="pxw-now pxw-panel" aria-label="Resources now">
          <div className="pxw-in">
            <h2 className="pxw-now__title">Your resources now</h2>
            <PxMeters state={state} />
          </div>
        </section>

        <h2 className="pxw-section">What will you do?</h2>
        <div className="pxw-opts" role="group" aria-label="Options">
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
        </div>

        <div className="challenge-nasa pxw-nasa">
          <button
            type="button"
            className="pxw-btn pxw-btn--small"
            aria-expanded={drawerOpen}
            aria-controls="nasa-drawer-slot"
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <Icon name="satellite" scale={1} /> How NASA handles this <Icon name={drawerOpen ? 'arrow-up' : 'arrow-down'} scale={1} />
          </button>
          <div id="nasa-drawer-slot">
            {drawerOpen && <NasaDrawer challengeId={cid} onClose={() => setDrawerOpen(false)} />}
          </div>
        </div>
      </div>

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
