import ResourceBar from './ResourceBar.jsx';
import { METERS, SCIENCE_GOAL } from './kidText.js';

// The four meters plus Science with its goal. Used on the Dashboard, Sol Summary and Debrief.
// `final` adds a ✓ / ✗ for the Science goal (only meaningful at the end of the mission).
export default function MeterPanel({ state, final = false }) {
  const met = state.S >= SCIENCE_GOAL;

  return (
    <section className="dash-meters" aria-label="Resources">
      {METERS.map((m) => (
        <ResourceBar key={m.key} label={m.label} icon={m.icon} value={state[m.key]} />
      ))}
      <div className={`science ${met ? 'is-met' : ''}`}>
        <span className="science__label">
          <span aria-hidden="true">🔬</span> SCIENCE
        </span>
        <span className="science__value">{state.S}</span>
        <span className="science__goal">
          goal: {SCIENCE_GOAL}
          {(met || final) && (met ? ' ✓' : ' ✗')}
        </span>
      </div>
    </section>
  );
}
