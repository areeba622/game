import { useCallback, useMemo, useReducer, useState } from 'react';
import '../styles/pixel-title.css';
import '../styles/pixel-intro.css';
import TitleScene from '../components/TitleScene.jsx';
import { newGame } from '../game/game.js';
import { commanderName } from '../components/commander.js';
import { NASA_CONTENT, SPACE_WEATHER_LABEL } from '../data/nasaContent.js';
import { BEATS, GAME_STORY_NOTE, PHOTO_ALT, PHOTO_CAPTION, fillText } from '../components/intro/introScript.js';
import { Astronaut, Portrait } from '../components/intro/PixelKit.jsx';
import { Btn, Chip, Panel } from '../components/intro/ui.jsx';
import SceneCanvas from '../components/intro/SceneCanvas.jsx';
import DialogueBox from '../components/intro/DialogueBox.jsx';
import ChoiceList from '../components/intro/ChoiceList.jsx';
import ChapterBanner from '../components/intro/ChapterBanner.jsx';
import ChapterHud from '../components/intro/ChapterHud.jsx';
import IntroModal from '../components/intro/IntroModal.jsx';
import Answer from '../components/intro/widgets/Answer.jsx';
import Crew from '../components/intro/widgets/Crew.jsx';
import Stamp from '../components/intro/widgets/Stamp.jsx';
import Duties from '../components/intro/widgets/Duties.jsx';
import Resources from '../components/intro/widgets/Resources.jsx';
import Challenges from '../components/intro/widgets/Challenges.jsx';
import Sols from '../components/intro/widgets/Sols.jsx';
import StormDemo from '../components/intro/widgets/StormDemo.jsx';
import Practice from '../components/intro/widgets/Practice.jsx';
import Accept from '../components/intro/widgets/Accept.jsx';

// Screen 3 — Intro: a short story that teaches the game, then hands over to the Dashboard.
// The game is already started (Callsign called actions.startMission). This screen only keeps
// its own local UI state. It never starts, changes or ends the game.

// A real photo of Mars, if the file exists in src/assets (never a hotlink, never invented).
const PHOTOS = import.meta.glob('../assets/mars-landing.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });
const PHOTO_URL = Object.values(PHOTOS)[0] ?? null;

const SCENES = ['control', 'mars', 'storm'];
const WIDGETS = {
  answer: Answer,
  crew: Crew,
  stamp: Stamp,
  duties: Duties,
  resources: Resources,
  challenges: Challenges,
  sols: Sols,
  storm: StormDemo,
  practice: Practice,
  accept: Accept,
};

const clone = (x) => JSON.parse(JSON.stringify(x));

// ----- story engine (local state only) -----
// cur: the step on screen. q: the steps still to come. banner: chapter number being announced.
function enterBeat(s, i, fromBack) {
  const b = BEATS[i];
  const announce = b.ch !== s.lastCh && !fromBack && !s.seen[i];
  const base = { ...s, beat: i, scene: b.scene, q: clone(b.steps), youSaid: '', cur: null, lastCh: b.ch };
  return announce ? { ...base, banner: b.ch } : advance(base);
}

function advance(s) {
  const q = [...s.q];
  let scene = s.scene;
  for (;;) {
    const step = q.shift();
    if (!step) {
      const seen = { ...s.seen, [s.beat]: true };
      if (s.beat + 1 < BEATS.length) return enterBeat({ ...s, seen, q: [], scene }, s.beat + 1, false);
      return { ...s, seen, q, scene, cur: null };
    }
    if (step.scene) {
      scene = step.scene;
      continue;
    }
    const key = s.key + 1;
    if (step.say) return { ...s, q, scene, key, cur: { ...step, you: s.youSaid, key }, lastSay: { ...step, key }, youSaid: '' };
    if (step.ask) return { ...s, q, scene, key, cur: { ...step, key } };
    if (step.widget) return { ...s, q, scene, key, cur: { ...step, key } };
  }
}

function reducer(s, a) {
  switch (a.type) {
    case 'NEXT':
      return advance(s);
    case 'BANNER_DONE':
      return s.banner === null ? s : advance({ ...s, banner: null });
    case 'REPLY': {
      const [text, steps] = s.cur.ask[a.index];
      return advance({ ...s, youSaid: text, q: [...clone(steps), ...s.q] });
    }
    case 'INSERT':
      return advance({ ...s, q: [a.step, ...s.q] });
    case 'BACK':
      return s.beat <= 0 ? s : enterBeat(s, s.beat - 1, true);
    default:
      return s;
  }
}

const initialEngine = () =>
  enterBeat({ beat: 0, scene: 'control', q: [], cur: null, lastSay: null, youSaid: '', seen: {}, lastCh: -1, banner: null, key: 0 }, 0, false);

const article = (flare) => (/^[AEFHILMNORSX]/i.test(flare) ? 'an' : 'a');

export default function Intro({ state, go }) {
  const [engine, send] = useReducer(reducer, null, initialEngine);
  const [modal, setModal] = useState(null); // null | 'confirm' | 'done'

  // Everything the story needs from the real game, read once.
  const ctx = useMemo(() => {
    const nick = state.nickname;
    const commander = commanderName(state);
    const event = state.event;
    const flare = event ? `${article(event.classType)} ${event.classType} flare on ${event.date}` : 'a real solar flare';
    const start = newGame(state.severity);
    return {
      nick,
      commander,
      severity: state.severity,
      event,
      flare,
      start,
      // A throwaway game with Oxygen and Power low, for the practice decision. Never changed.
      practice: { ...start, O: 45, P: 40 },
      fill: (t) => fillText(t, { nick, commander, flare }),
    };
  }, [state]);

  // Widget progress lives here, so going Back keeps what was already tapped.
  const [w, setW] = useState(() => ({
    crew: [], crewSel: null, duties: [], res: [], resSel: null, demo: { O: ctx.start.O, W: ctx.start.W, P: ctx.start.P, C: ctx.start.C, S: ctx.start.S },
    chal: [], chalSel: null, sols: [], solSel: null, shelter: null, tried: [], size: null, prac: null, pracDone: false, pledge: [],
  }));
  // patch takes an object, or a function of the latest progress (so quick taps never lose one).
  const patch = useCallback((p) => setW((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) })), []);
  const bannerDone = useCallback(() => send({ type: 'BANNER_DONE' }), []);

  const chapter = BEATS[engine.beat].ch;
  const instant = !!engine.seen[engine.beat];
  const { cur } = engine;

  const badgeFor = (step) => {
    if (!step.badge) return null;
    if (step.t.includes('{FLARE}')) {
      return { label: `${SPACE_WEATHER_LABEL}${ctx.event?.date ? ` · ${ctx.event.date}` : ''}` };
    }
    return { label: 'REAL NASA', src: `Source: ${NASA_CONTENT.M.sourceName}` };
  };

  function back() {
    if (engine.beat <= 0) go('callsign');
    else send({ type: 'BACK' });
  }

  let content = null;
  if (cur?.say) {
    content = (
      <DialogueBox key={cur.key} who={cur.say} text={ctx.fill(cur.t)} you={cur.you} badge={badgeFor(cur)} instant={instant} onNext={() => send({ type: 'NEXT' })} />
    );
  } else if (cur?.ask) {
    content = (
      <>
        {engine.lastSay && (
          <DialogueBox key={`last-${engine.lastSay.key}`} who={engine.lastSay.say} text={ctx.fill(engine.lastSay.t)} instant showNext={false} />
        )}
        <ChoiceList key={cur.key} replies={cur.ask.map((r) => r[0])} onPick={(index) => send({ type: 'REPLY', index })} />
      </>
    );
  } else if (cur?.widget) {
    const Widget = WIDGETS[cur.widget];
    content = (
      <Widget
        key={cur.key}
        w={w}
        patch={patch}
        ctx={ctx}
        onNext={() => send({ type: 'NEXT' })}
        onFeedback={(t) => send({ type: 'INSERT', step: { say: 'mc', t } })}
        onAccept={() => setModal('confirm')}
      />
    );
  }

  const showPhoto = PHOTO_URL && engine.beat === 1 && engine.scene === 'mars';

  return (
    <main className="pixel-intro">
      <TitleScene />
      <div className="pi-app">
        <ChapterHud chapter={chapter} onBack={back} onSkip={() => go('dashboard')} />

        <Panel cls="pi-scenebox">
          <div className="pi-stage">
            {SCENES.map((name) => (
              <SceneCanvas key={name} name={name} active={engine.scene === name} className={`pi-stk${engine.scene === name ? ' on' : ''}`} />
            ))}
            {engine.scene === 'control' && (
              <div className="pi-live">
                <i />
                LIVE: MISSION CONTROL
              </div>
            )}
          </div>
        </Panel>

        {chapter === 0 && (
          <div className="pi-chips pi-gamenote">
            <Chip kind="game">{GAME_STORY_NOTE}</Chip>
          </div>
        )}

        {showPhoto && (
          <figure className="pi-photo">
            <img src={PHOTO_URL} alt={PHOTO_ALT} />
            <figcaption>
              <Chip kind="real">REAL NASA</Chip> {PHOTO_CAPTION}
            </figcaption>
          </figure>
        )}

        <div className="pi-panel">{content}</div>
      </div>

      {engine.banner !== null && <ChapterBanner key={engine.banner} chapter={engine.banner} onDone={bannerDone} />}

      {modal === 'confirm' && (
        <IntroModal label="Accept command" onClose={() => setModal(null)}>
          <div className="pi-center-text">
            <div className="pi-pc pi-big">
              <Portrait who="you" size={9} />
            </div>
            <h2 className="pi-h2">Ready, {ctx.commander}?</h2>
            <p className="pi-mut pi-gap">Once you accept, the mission begins. The crew is counting on you!</p>
            <div className="pi-row pi-c">
              <Btn onClick={() => setModal('done')}>Yes, I accept!</Btn>
              <Btn cls="dark" onClick={() => setModal(null)}>
                Not yet
              </Btn>
            </div>
          </div>
        </IntroModal>
      )}

      {modal === 'done' && (
        <IntroModal
          label="Command accepted"
          extra={
            <div className="pi-conf" aria-hidden="true">
              {Array.from({ length: 40 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    left: `${(i * 2.5 + (i % 3) * 0.7).toFixed(1)}%`,
                    background: ['#ff8a3d', '#ffd23f', '#6bd44a', '#4fd6ff', '#ff4a45'][i % 5],
                    animationDuration: `${(3 + (i % 7) * 0.45).toFixed(1)}s`,
                    animationDelay: `${((i % 5) * 0.4).toFixed(1)}s`,
                  }}
                />
              ))}
            </div>
          }
        >
          <div className="pi-center-text">
            <Panel cls="pi-stamp small">{ctx.commander.toUpperCase()}</Panel>
            <div className="pi-row pi-c pi-crewline" aria-hidden="true">
              {['mira', 'kai', 'you', 'zuri', 'leo'].map((k, j) => (
                <div key={k} className="pi-bob" style={{ animationDuration: `${(0.8 + j * 0.1).toFixed(1)}s` }}>
                  <Astronaut who={k} scale={k === 'you' ? 6 : 5} />
                </div>
              ))}
            </div>
            <h2 className="pi-h2">COMMAND ACCEPTED!</h2>
            <p className="pi-mut pi-gap">The crew cheers. Sol 1 is about to begin.</p>
            <Btn cls="big" onClick={() => go('dashboard')}>
              Go to mission base ▸
            </Btn>
          </div>
        </IntroModal>
      )}
    </main>
  );
}
