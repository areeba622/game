import { useState } from 'react';
import { commanderName } from '../components/commander.js';
import MarsPhoto from '../components/MarsPhoto.jsx';

// Real NASA photo on slide 1. The credit comes from the image's NASA page
// (also in src/assets/credits.txt and on the Sources screen). It is a real photo
// of Mars, not of our outpost, and the caption says so.
const PHOTO_ALT = 'Close-up of rocky Martian ground with pale, bright mineral patches.';
const PHOTO_CAPTION =
  'Close-up of a rock on Mars, taken by the Perseverance rover. Not our outpost. NASA/JPL-Caltech/LANL/CNES/IRAP';

// Screen 3 — Intro (docs/WIREFRAMES.md). One slide at a time; Next / Skip.
function buildSlides(commander) {
  return [
    {
      heading: 'Landing successful!',
      lines: [`Welcome, ${commander}.`, 'You are in charge of a Mars outpost.'],
      photo: true,
    },
    {
      heading: 'Your job',
      lines: ['Solve 5 challenges in 3 Sols.', '(A Sol is one day on Mars.)'],
    },
    // Day 2: add slide 3 ("Every choice costs something") and
    // slide 4 ("A storm is coming") here, with the text from docs/WIREFRAMES.md Screen 3.
  ];
}

export default function Intro({ state, go }) {
  const [index, setIndex] = useState(0);
  const slides = buildSlides(commanderName(state));
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  function next() {
    if (isLast) go('dashboard');
    else setIndex(index + 1);
  }

  return (
    <main className="screen screen-intro">
      <div className="card intro-card">
        <div className="intro-dots" aria-hidden="true">
          {slides.map((_, i) => (
            <span key={i} className={i === index ? 'intro-dot is-active' : 'intro-dot'} />
          ))}
        </div>

        <section className="intro-slide" aria-live="polite">
          {slide.photo && <MarsPhoto alt={PHOTO_ALT} caption={PHOTO_CAPTION} />}

          <p className="intro-count">
            {index + 1} of {slides.length}
          </p>
          <h1 className="intro-heading">{slide.heading}</h1>
          {slide.lines.map((line) => (
            <p key={line} className="intro-line">
              {line}
            </p>
          ))}
        </section>

        <div className="intro-actions">
          <button type="button" className="btn-primary" onClick={next}>
            Next
          </button>
          <button type="button" onClick={() => go('dashboard')}>
            Skip
          </button>
        </div>
      </div>
    </main>
  );
}
