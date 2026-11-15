import { SPACE_WEATHER_LABEL } from '../data/nasaContent.js';
import { STORM_SIZE } from './kidText.js';
import Icon from './Icon.jsx';

// Storm forecast line for the HUD. Same facts and wording as StormForecast.jsx:
// based on a real flare record, a saved copy (never "live").
export default function PxStorm({ state }) {
  const { event, severity, sheltered, sol, log } = state;
  const stormLog = log.find((entry) => entry.kind === 'storm');
  const passed = sol >= 3 || Boolean(stormLog);
  const size = STORM_SIZE[severity];

  return (
    <section className="pxw-storm" aria-labelledby="pxw-storm-title">
      <h2 id="pxw-storm-title" className="pxw-storm__title">
        <Icon name="sun" scale={1} />
        Storm forecast
      </h2>
      <p className="pxw-storm__text">
        {passed ? (
          <strong>The storm has passed.</strong>
        ) : (
          <>
            Arrives at the <strong>END of SOL 2</strong>. Size: <strong className="pxw-storm__size">{size}</strong>.
          </>
        )}
        {event && (
          <>
            {' '}
            Based on a real <strong>{event.classType}</strong> solar flare, {event.date}.
          </>
        )}
      </p>
      <p className={`pxw-storm__status ${passed ? (stormLog ? 'is-hit' : 'is-safe') : sheltered ? 'is-safe' : 'is-warn'}`}>
        {passed ? (
          stormLog ? (
            <>
              <Icon name="storm" scale={1} /> {stormLog.text}
            </>
          ) : (
            <>
              <Icon name="shelter" scale={1} /> Your crew was sheltered. No harm.
            </>
          )
        ) : sheltered ? (
          <>
            <Icon name="shelter" scale={1} /> Crew status: <strong>SHELTERED</strong>
          </>
        ) : (
          <>
            <Icon name="warning" scale={1} /> Crew status: <strong>NOT SHELTERED yet</strong>
          </>
        )}
      </p>
      <p className="pxw-storm__badge">
        <Icon name="globe" scale={1} />
        {SPACE_WEATHER_LABEL}
        {event?.date ? ` · ${event.date}` : ''}
      </p>
    </section>
  );
}
