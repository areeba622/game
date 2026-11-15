import { useEffect, useRef, useState } from 'react';
import Modal from '../components/Modal.jsx';
import MeterPanel from '../components/MeterPanel.jsx';
import StormForecast from '../components/StormForecast.jsx';
import BaseMap from '../components/BaseMap.jsx';
import MissionControl from '../components/MissionControl.jsx';
import MorningReport from '../components/MorningReport.jsx';
import { commanderName } from '../components/commander.js';
import { CHALLENGE_ORDER, CARD_TEXT } from '../components/kidText.js';
import { CHALLENGES } from '../game/challenges.js';

// Screen 4 — Dashboard (docs/WIREFRAMES.md).
// Jobs per Sol, mirrors CLAUDE.md 5.2. TODO: use an export from game.js if Person A adds one.
const JOBS_PER_SOL = { 1: 2, 2: 2, 3: 1 };
const JOBS_WORD = { 1: 'ONE CHALLENGE', 2: 'TWO CHALLENGES' };
const SOLS = [1, 2, 3];

// Crisp 2px stars as box-shadows (positions in vw/vh so they fit any screen).
function starField(n, seed) {
  let s = seed;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const colors = ['fff', 'b8c4ff', 'ffc890', '8feaff'];
  return Array.from({ length: n }, () => `${(r() * 100).toFixed(1)}vw ${(r() * 100).toFixed(1)}vh 0 #${colors[(r() * 4) | 0]}`).join(',');
}
const STARS_A = starField(60, 7);
const STARS_B = starField(40, 13);

/* Pixel Mars (64x64, scaled up with no smoothing) */
function PixelMars() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current.getContext('2d');
    const pal = ['#3d1220', '#6e2220', '#a8401f', '#d2602a', '#ee8a3e', '#f9b86a'];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = 0;
    function draw(t) {
      c.clearRect(0, 0, 64, 64);
      const R = 30;
      for (let y = -R - 2; y <= R + 2; y++) for (let x = -R - 2; x <= R + 2; x++) {
        const dx = x / R, dy = y / R, d = dx * dx + dy * dy;
        if (d > 1) {
          if (d < 1.1 && (x + y) % 2 === 0) { c.fillStyle = '#7a3a5e'; c.fillRect(32 + x, 32 + y, 1, 1); }
          continue;
        }
        const nz = Math.sqrt(1 - d), lon = Math.atan2(dx, nz) + t * 0.12;
        let col;
        if (dy < -0.84 && nz > 0.25) col = '#e9e3f5';
        else {
          const v = Math.sin(lon * 3 + Math.sin(dy * 4) * 1.4) + Math.sin(lon * 8 + dy * 3) * 0.5;
          const l = -dx * 0.5 - dy * 0.45 + nz * 0.75;
          col = pal[Math.max(0, Math.min(5, Math.floor((l * 0.85 + v * 0.09 + 0.08) * 6)))];
        }
        c.fillStyle = col;
        c.fillRect(32 + x, 32 + y, 1, 1);
      }
    }
    function loop(ms) {
      if (ms - last > 110) { last = ms; draw(reduce ? 0 : ms / 1000); }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="mb-dash__planet mb-dash__planet--mars" width="64" height="64" aria-hidden="true" />;
}

/* Small grey moon (24x24, drawn once) */
function PixelMoon() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current.getContext('2d');
    for (let y = -10; y <= 10; y++) for (let x = -10; x <= 10; x++) {
      const d = x * x + y * y;
      if (d > 100) continue;
      const l = -x * 0.5 - y * 0.5 + Math.sqrt(100 - d) * 0.8;
      c.fillStyle = l > 6 ? '#f0e4f4' : l > 2 ? '#a898b8' : '#4a3f66';
      c.fillRect(12 + x, 12 + y, 1, 1);
    }
    c.fillStyle = '#4a3f66';
    [[8, 9], [9, 9], [15, 14], [14, 15], [10, 16]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
  }, []);
  return <canvas ref={ref} className="mb-dash__planet mb-dash__planet--moon" width="24" height="24" aria-hidden="true" />;
}

const css = `

/* ---------- theme (move to :root later to share across components) ---------- */
.mb-dash {
  --mb-night: #080818;
  --mb-steel: #16232a;
  --mb-steel2: #1d2f37;
  --mb-steel3: #2a414a;
  --mb-hi: #3a565f;
  --mb-ink: #05090c;
  --mb-amber: #ffc93c;
  --mb-orange: #e2793a;
  --mb-rust: #a8401f;
  --mb-red: #cc4630;
  --mb-mint: #7fe9d6;
  --mb-cream: #fff3dc;
  --mb-sand: #ffe3b8;
  --mb-display: 'VT323', ui-monospace, monospace;
  --mb-body: 'VT323', ui-monospace, monospace;
  --mb-pad: clamp(14px, 3vw, 32px);
  --mb-notch8: polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px));
  --mb-notch4: polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px));
  --mb-notch6: polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px));
  --mb-notch3: polygon(0 3px, 3px 3px, 3px 0, calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px));

  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  min-height: 100vh;
  padding: calc(var(--mb-pad) + 14px) var(--mb-pad) calc(18vh + env(safe-area-inset-bottom, 0px));
  overflow-x: hidden;
  color: var(--mb-cream);
  font: 400 clamp(18px, 2vw, 22px)/1.4 var(--mb-body);
  background: linear-gradient(180deg, #080818 0 30%, #0d0b26 30% 52%, #14103a 52% 68%, #1d1248 68% 80%, #2c1650 80% 90%, #451f4a 90% 100%);
}
.mb-dash__inner {
  width: min(100%, 1100px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(28px, 4vw, 40px);
}

/* ---------- sky: stars, Mars, moon, dunes ---------- */
.mb-dash__stars {
  position: fixed; top: 0; left: 0; z-index: -4; width: 2px; height: 2px; pointer-events: none;
  animation: mb-twinkle 3s steps(1) infinite;
}
.mb-dash__stars--b { animation-delay: 1.5s; }
.mb-dash__planet { position: absolute; z-index: -3; pointer-events: none; image-rendering: pixelated; }
.mb-dash__planet--mars { top: -6vmin; right: -8vmin; width: 34vmin; height: 34vmin; animation: mb-float 8s steps(8) infinite alternate; }
.mb-dash__planet--moon { top: 40vh; left: -2vmin; width: 11vmin; height: 11vmin; animation: mb-float 7s steps(7) infinite alternate-reverse; }
.mb-dash__dunes {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: -2; height: 16vh; pointer-events: none;
  background: linear-gradient(#a24a2a 0 22%, #7a3020 22% 58%, #4a1a1e 58%);
  clip-path: polygon(0 40%, 8% 40%, 8% 28%, 20% 28%, 20% 44%, 34% 44%, 34% 22%, 46% 22%, 46% 36%, 60% 36%, 60% 18%, 74% 18%, 74% 32%, 88% 32%, 88% 24%, 100% 24%, 100% 100%, 0 100%);
}

/* ---------- entrance (a short pixel flicker) ---------- */
.mb-dash__header, .mb-dash__block, .mb-dash__challenges {
  animation: mb-boot 0.7s steps(1) both;
  animation-delay: calc(var(--mb-i, 0) * 120ms);
}

/* ---------- pixel panel: stepped corners, bevelled fill ---------- */
.mb-panel {
  position: relative; isolation: isolate;
  padding: clamp(16px, 2.6vw, 24px);
  background: var(--mb-orange);
  clip-path: var(--mb-notch8);
}
.mb-panel::before {
  content: ''; position: absolute; inset: 4px; z-index: -1;
  background: var(--mb-steel);
  clip-path: var(--mb-notch4);
  box-shadow: inset 4px 4px 0 var(--mb-steel2), inset -4px -4px 0 #0e181d;
}

/* ---------- header ---------- */
.mb-dash__header { --mb-i: 0; }
.mb-dash__row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 28px; }
.mb-dash__brand { font: 400 clamp(20px, 2.6vw, 26px)/1.2 var(--mb-display); color: var(--mb-cream); text-shadow: 2px 2px 0 var(--mb-rust), 4px 4px 0 var(--mb-ink); }
.mb-dash__stat { display: inline-flex; align-items: center; gap: 12px; font: 400 clamp(18px, 1.6vw, 20px)/1.4 var(--mb-display); color: var(--mb-amber); }
.mb-dash__restart { margin-left: auto; }
.mb-dash__commander { margin: 14px 0 0; padding-left: 10px; border-left: 4px solid var(--mb-amber); color: var(--mb-sand); letter-spacing: 0.04em; }

.mb-pips, .mb-bar { display: inline-flex; gap: 6px; }
.mb-pip, .mb-seg { background: var(--mb-steel3); box-shadow: 0 0 0 2px var(--mb-ink); }
.mb-pip { width: 14px; height: 14px; }
.mb-seg { width: clamp(18px, 3.5vw, 28px); height: 12px; }
.mb-pip.is-on, .mb-seg.is-on {
  background: var(--mb-amber);
  box-shadow: 0 0 0 2px var(--mb-ink), inset 3px 3px 0 #fff3a0, inset -3px -3px 0 #e08a1e;
}

/* ---------- challenges ---------- */
.mb-dash__challenges { --mb-i: 3; position: relative; }
.mb-ribbon {
  position: absolute; left: 50%; top: -14px; z-index: 3; translate: -50% 0; isolation: isolate;
  width: max-content; max-width: calc(100% - 28px); margin: 0; padding: 0.95em 1.6em;
  text-align: center; font: 400 clamp(18px, 1.8vw, 20px)/1.4 var(--mb-display);
  color: var(--mb-cream); text-shadow: 2px 2px 0 var(--mb-rust);
  background: var(--mb-ink); clip-path: var(--mb-notch6);
}
.mb-ribbon::before {
  content: ''; position: absolute; inset: 3px; z-index: -1;
  background: var(--mb-orange); clip-path: var(--mb-notch3);
  box-shadow: inset 0 3px 0 #ffb070, inset 0 -3px 0 var(--mb-rust);
}

/* ---------- pixel buttons ---------- */
.mb-btn {
  font: 400 clamp(18px, 1.6vw, 20px)/1.3 var(--mb-display);
  color: var(--mb-cream); background: var(--mb-steel3);
  border: 0; border-radius: 0; padding: 1em 1.4em; cursor: pointer;
  box-shadow:
    inset 0 -4px var(--mb-steel), inset 0 4px var(--mb-hi),
    4px 0 var(--mb-ink), -4px 0 var(--mb-ink), 0 4px var(--mb-ink), 0 -4px var(--mb-ink), 0 8px #0a1216;
  transition: transform 0.1s steps(2);
}
.mb-btn:hover { background: var(--mb-hi); transform: translateY(-2px); }
.mb-btn:active { transform: translateY(4px); box-shadow: inset 0 4px var(--mb-steel), 4px 0 var(--mb-ink), -4px 0 var(--mb-ink), 0 4px var(--mb-ink), 0 -4px var(--mb-ink); }
.mb-btn:focus-visible { outline: 3px dashed #fff; outline-offset: 9px; }
.mb-btn--primary { color: #2a0f10; background: var(--mb-amber); box-shadow: inset 0 -4px #e08a1e, inset 0 4px #fff0a8, 4px 0 var(--mb-ink), -4px 0 var(--mb-ink), 0 4px var(--mb-ink), 0 -4px var(--mb-ink), 0 8px #7a2e22; }
.mb-btn--primary:hover { background: #fff0a8; }
.mb-btn--danger { background: var(--mb-red); box-shadow: inset 0 -4px #8a2a20, inset 0 4px #ff8a6a, 4px 0 var(--mb-ink), -4px 0 var(--mb-ink), 0 4px var(--mb-ink), 0 -4px var(--mb-ink), 0 8px #5a1a14; }
.mb-btn--danger:hover { background: #e0553d; }
.mb-btn--small { padding: 0.85em 1.1em; }

/* ---------- restart dialog content ---------- */
.mb-dash__modal-title { margin: 0 0 14px; font: 400 clamp(20px, 2.2vw, 24px)/1.3 var(--mb-display); color: var(--mb-amber); text-shadow: 2px 2px 0 var(--mb-ink); }
.mb-dash__modal-text { margin: 0 0 22px; font: 400 clamp(18px, 2.4vw, 22px)/1.4 var(--mb-body); }
.mb-dash__actions { display: flex; flex-wrap: wrap; gap: 20px; }

/* ---------- keyframes ---------- */
@keyframes mb-boot { 0% { opacity: 0; } 25% { opacity: 1; } 40% { opacity: 0; } 60% { opacity: 1; } 70% { opacity: 0.3; } 100% { opacity: 1; } }
@keyframes mb-twinkle { 50% { opacity: 0.25; } }
@keyframes mb-float { from { translate: 0 -8px; } to { translate: 0 10px; } }

@media (prefers-reduced-motion: reduce) {
  .mb-dash, .mb-dash *, .mb-dash::before, .mb-dash::after { animation: none !important; transition: none !important; }
}
`;

export default function Dashboard({ state, go, morningReport, actions }) {
  const [askRestart, setAskRestart] = useState(false);
  const quota = JOBS_PER_SOL[state.sol];
  const commander = commanderName(state);

  return (
    <>
      <style>{css}</style>
      <main className="screen screen-dashboard mb-dash">
        <span className="mb-dash__stars" style={{ boxShadow: STARS_A }} aria-hidden="true" />
        <span className="mb-dash__stars mb-dash__stars--b" style={{ boxShadow: STARS_B }} aria-hidden="true" />
        <PixelMars />
        <PixelMoon />
        <span className="mb-dash__dunes" aria-hidden="true" />

        <div className="mb-dash__inner">
          <header className="mb-panel mb-dash__header">
            <div className="mb-dash__row">
              <span className="mb-dash__brand">MARSBOUND</span>
              <span className="mb-dash__stat">
                <span className="mb-pips" aria-hidden="true">
                  {SOLS.map((n) => (
                    <i key={n} className={`mb-pip${n <= state.sol ? ' is-on' : ''}`} />
                  ))}
                </span>
                SOL {state.sol} of 3
              </span>
              <span className="mb-dash__stat">
                <span className="mb-bar" aria-hidden="true">
                  {Array.from({ length: quota }, (_, i) => (
                    <i key={i} className={`mb-seg${i < state.doneThisSol ? ' is-on' : ''}`} />
                  ))}
                </span>
                Jobs today: {state.doneThisSol}/{quota}
              </span>
              <button
                type="button"
                className="mb-btn mb-btn--danger mb-btn--small mb-dash__restart"
                onClick={() => setAskRestart(true)}
              >
                Restart
              </button>
            </div>
            <p className="mb-dash__commander">{commander}</p>
          </header>

          <MorningReport report={morningReport} state={state} onClose={actions.clearMorningReport} />

          <div className="mb-dash__block" style={{ '--mb-i': 1 }}>
            <MeterPanel state={state} />
          </div>

          <div className="mb-dash__block" style={{ '--mb-i': 2 }}>
            <StormForecast state={state} />
          </div>

          <section className="mb-dash__challenges" aria-labelledby="dash-challenges-title">
            <h2 id="dash-challenges-title" className="mb-ribbon">
              CHOOSE {JOBS_WORD[quota]} TODAY
            </h2>
            <BaseMap
              items={CHALLENGE_ORDER.map((id) => ({
                id,
                title: CHALLENGES[id].title,
                short: CARD_TEXT[id].short,
                // The storm chip is no longer true once the storm has passed (Sol 3).
                warning: id === 'R' && state.sol >= 3 ? null : CARD_TEXT[id].warning,
                doneOption: state.done[id],
              }))}
              onSelect={(id) => go('challenge', id)}
            />
          </section>

          <div className="mb-dash__block" style={{ '--mb-i': 8 }}>
            <MissionControl state={state} />
          </div>
        </div>

        {askRestart && (
          <Modal label="Start over?" onClose={() => setAskRestart(false)}>
            <div className="mb-panel">
              <h2 className="mb-dash__modal-title">Start over?</h2>
              <p className="mb-dash__modal-text">Your mission so far will be lost.</p>
              <div className="mb-dash__actions">
                <button type="button" className="mb-btn mb-btn--primary" onClick={() => setAskRestart(false)}>
                  Keep playing
                </button>
                <button type="button" className="mb-btn mb-btn--danger" onClick={actions.restart}>
                  Yes, restart
                </button>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </>
  );
}