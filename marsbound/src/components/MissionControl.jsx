import { missionControlLine } from './missionControlLine.js';

// Mission Control strip (Dashboard): one line at a time.
export default function MissionControl({ state }) {
  return (
    <section className="card mission-control" aria-label="Mission Control">
      <span className="mission-control__icon" aria-hidden="true">📻</span>
      <p className="mission-control__text">
        <strong>MISSION CONTROL:</strong> “{missionControlLine(state)}”
      </p>
    </section>
  );
}
