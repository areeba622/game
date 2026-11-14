import Button from '../components/Button.jsx';
import SceneBackdrop from '../components/SceneBackdrop.jsx';

// Screen 1 — Title (docs/WIREFRAMES.md).
// TODO: Mars photo background with a dark overlay and its credit line, once a real
// NASA photo and its exact credit are in src/assets/ and credits.txt. Do not invent a credit.
// Until then SceneBackdrop (CSS only) is the Title visual.
export default function Title({ go }) {
  return (
    <main className="px mb-title">
      <SceneBackdrop variant="title" />
      <div className="mb-title__hero">
        <h1 className="mb-title__name">MARSBOUND</h1>
        <p className="mb-title__sub">THE NEXT FRONTIER</p>
        <p className="mb-title__tagline">“Humanity's next home is waiting.”</p>

        <div className="mb-title__actions">
          <Button variant="primary" onClick={() => go('callsign')}>
            Start Mission
          </Button>
          <Button onClick={() => go('sources')}>Sources &amp; Data</Button>
        </div>
      </div>

      <p className="mb-title__footer">Simulated mission · NASA data credited</p>
    </main>
  );
}
