import '../styles/pixel-title.css';
import TitleScene from '../components/TitleScene.jsx';

// Screen 1 — Title (docs/WIREFRAMES.md). A pixel-art Mars scene with the game name and the start panel.
// TODO: Mars photo background with its credit line, once a real NASA photo and its exact credit
// are in src/assets/ and credits.txt. Do not invent a credit.
export default function Title({ go }) {
  return (
    <main className="ts">
      <TitleScene />
      <div className="ts-stage">
        <div className="ts-hero">
          <h1 className="ts-name">MARSBOUND</h1>
          <p className="ts-sub">THE NEXT FRONTIER</p>
        </div>

        <section className="ts-panel" aria-label="Start">
          <p className="ts-tagline">“Humanity's next home is waiting.”</p>
          <div className="ts-actions">
            <button type="button" className="ts-btn" onClick={() => go('callsign')}>
              Start Mission
            </button>
            <button type="button" className="ts-link" onClick={() => go('sources')}>
              Sources &amp; Data
            </button>
          </div>
          <p className="ts-foot">Simulated mission · NASA data credited</p>
        </section>
      </div>
    </main>
  );
}
