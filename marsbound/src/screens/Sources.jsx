// ── Sources & Data screen (WIREFRAMES.md Screen 8) ───────────────────────
// Everything shown here comes from spaceWeatherEvents.json, NASA_CONTENT
// and src/assets/credits.txt. Do not add a source that isn't in those files.
import { NASA_CONTENT } from '../data/nasaContent';
import spaceWeatherEvents from '../data/spaceWeatherEvents.json';

// Vite glob: resolves to {} (not an error) if credits.txt doesn't exist yet,
// which is how we tell "file missing" apart from "file exists but empty".
const creditsFiles = import.meta.glob('../assets/credits.txt', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const creditsText = Object.values(creditsFiles)[0] ?? null;
const creditLines = creditsText
  ? creditsText.split('\n').map((line) => line.trim()).filter(Boolean)
  : [];

// Canonical challenge order (CLAUDE.md section 3).
const CHALLENGE_ORDER = ['L', 'R', 'W', 'G', 'M'];

export default function Sources({ state, go }) {
  // Sources only opens from Title or Debrief. `phase` is 'active' from the
  // moment a game starts until it ends, and Title is only ever shown before
  // that — so 'active' means we came from Title, anything else (a finished
  // mission) means we came from Debrief.
  const backTo = state.phase === 'active' ? 'title' : 'debrief';

  return (
    <div className="screen screen-sources">
      <div className="sources-header">
        <button type="button" onClick={() => go(backTo)}>
          ← Back
        </button>
        <h1>Sources &amp; Data</h1>
      </div>

      {/* Flare records: real data, not live */}
      <section className="sources-section">
        <h2>🟦 REAL NASA</h2>
        <h3>Solar flare records (NASA DONKI, saved copies)</h3>
        <ul>
          {spaceWeatherEvents.map((event) => (
            <li key={event.id}>
              {event.classType} · {event.date}{' '}
              <a href={event.url} target="_blank" rel="noopener noreferrer">
                link
              </a>
            </li>
          ))}
        </ul>
        <p>These are old records, not live data.</p>
      </section>

      {/* Facts used in the game, one per challenge */}
      <section className="sources-section">
        <h3>Facts used in the game</h3>
        <ul>
          {CHALLENGE_ORDER.map((id) => {
            const content = NASA_CONTENT[id];
            if (!content) return null;
            return (
              <li key={id}>
                {content.title}: {content.sourceName}{' '}
                <a href={content.sourceUrl} target="_blank" rel="noopener noreferrer">
                  link
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Image credits */}
      <section className="sources-section">
        <h3>Image credits</h3>
        {creditLines.length > 0 ? (
          <ul>
            {creditLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : (
          <p>No image credits yet. Add credits to src/assets/credits.txt.</p>
        )}
      </section>

      {/* Game numbers disclaimer */}
      <section className="sources-section">
        <h2>🟧 GAME NUMBERS</h2>
        <ul>
          <li>Resource values, costs and results are simplified and simulated.</li>
          <li>NASA has not landed people on Mars.</li>
          <li>
            The storm is based on a real flare record, but it is not a reading from Mars.
          </li>
          <li>Crew Health damage (−10, −30, −55) is a game number.</li>
        </ul>
      </section>

      {/* How we used NASA data */}
      <section className="sources-section">
        <h3>How we used NASA data</h3>
        <p>
          MARSBOUND uses saved copies of six real solar flare records from NASA’s DONKI
          archive to set the size of the storm in each game. The facts in the ‘How NASA
          handles this’ boxes come from NASA pages and are linked here. Game numbers are
          simplified so children can see trade-offs. They are not NASA measurements.
        </p>
      </section>

      <button type="button" onClick={() => go(backTo)}>
        Back
      </button>
    </div>
  );
}
