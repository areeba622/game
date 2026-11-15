import { useEffect, useRef, useState } from 'react';
import { Portrait } from './PixelKit.jsx';
import { Btn, Chip, Panel } from './ui.jsx';
import { useReducedMotion } from './useReducedMotion.js';
import { WHO } from './introScript.js';

const STEP_MS = 26;

// One line of dialogue. The text types out; tapping Next (or the box) finishes it first.
// The whole line is always in an aria-live region, so a screen reader hears it once, in full.
// `instant` skips typing (reduced motion, or a chapter that was already played).
// `badge` is an optional REAL NASA chip: { label, src }. The words are shown, not just a colour.
export default function DialogueBox({ who, text, you, badge, instant, showNext = true, onNext }) {
  const reduced = useReducedMotion();
  const skip = reduced || instant || !showNext;
  const [count, setCount] = useState(0);
  const nextRef = useRef(null);
  const done = skip || count >= text.length;

  useEffect(() => {
    if (skip) return undefined;
    const id = window.setInterval(() => setCount((n) => Math.min(text.length, n + 2)), STEP_MS);
    return () => window.clearInterval(id);
  }, [skip, text]);

  // Once the line is complete, put focus on Next so Enter or Space keeps the story moving.
  useEffect(() => {
    if (done && showNext) nextRef.current?.focus();
  }, [done, showNext]);

  const [name, role] = WHO[who];
  const shown = done ? text : text.slice(0, count);

  function handleNext() {
    if (!done) setCount(text.length);
    else onNext();
  }

  return (
    <>
      <Panel cls="pi-dlg" onClick={() => !done && setCount(text.length)}>
        <div className="pi-port">
          <div className="pi-pc">
            <Portrait who={who} />
          </div>
          <div className="pi-pn">{who === 'mc' ? 'Mission Control' : name}</div>
        </div>
        <div className="pi-say">
          <div className="pi-who">
            {name}
            <span className="pi-hide-m"> | {role}</span>
          </div>
          {you && <div className="pi-you">YOU: {you}</div>}
          <p className="pi-sr" aria-live="polite">
            {text}
          </p>
          <p className={`pi-txt${done ? '' : ' pi-cursor'}`} aria-hidden="true">
            {shown}
          </p>
          {badge && done && (
            <div className="pi-badge">
              <Chip kind="real">{badge.label}</Chip>
              {badge.src && <span className="pi-src">{badge.src}</span>}
            </div>
          )}
        </div>
      </Panel>
      {showNext && (
        <div className="pi-act">
          <Btn onClick={handleNext} ref={nextRef}>
            Next ▸
          </Btn>
        </div>
      )}
    </>
  );
}
