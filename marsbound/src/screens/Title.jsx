// Screen 1 — Title (docs/WIREFRAMES.md).
// TODO: Mars photo background with a dark overlay and its credit line, once a real
// NASA photo and its exact credit are in src/assets/ and credits.txt. Do not invent a credit.
export default function Title({ go }) {
  return (
    <main className="screen screen-title">
      <div className="title-hero">
        <h1 className="title-name">MARSBOUND</h1>
        <p className="title-sub">THE NEXT FRONTIER</p>
        <p className="title-tagline">“Humanity's next home is waiting.”</p>

        <div className="title-actions">
          <button type="button" className="btn-primary" onClick={() => go('callsign')}>
            Start Mission
          </button>
          <button type="button" onClick={() => go('sources')}>
            Sources &amp; Data
          </button>
        </div>
      </div>

      <p className="title-footer">Simulated mission · NASA data credited</p>
    </main>
  );
}
