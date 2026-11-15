import { useEffect, useRef } from 'react';
import { Ico } from './PixelKit.jsx';
import { CHAPTERS } from './introScript.js';
import { useReducedMotion } from './useReducedMotion.js';

// The full-screen chapter title. It goes away by itself after a moment, or when tapped.
export default function ChapterBanner({ chapter, onDone }) {
  const reduced = useReducedMotion();
  const finished = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      onDone();
    };
    const id = window.setTimeout(finish, reduced ? 250 : 1500);
    return () => window.clearTimeout(id);
  }, [onDone, reduced]);

  function tap() {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }

  return (
    <div className="pi-ov pi-ov-black" role="status" onClick={tap}>
      <div className="pi-banner">
        <div className="pi-center">
          <Ico n={CHAPTERS[chapter][1]} s={12} />
        </div>
        <div className="pi-n">CHAPTER {chapter + 1}</div>
        <h2>{CHAPTERS[chapter][0].toUpperCase()}</h2>
      </div>
    </div>
  );
}
