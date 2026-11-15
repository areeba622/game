import { useDonki, stormBadgeText } from './useDonki.js';
import DonkiDetails from './DonkiDetails.jsx';
import { STORM_SIZE } from './kidText.js';

// Storm card (Dashboard). Based on a real flare record; never called "live".
export default function StormForecast({ state }) {
  const { event, severity, sheltered, sol, log } = state;
  const stormLog = log.find((entry) => entry.kind === 'storm');
  const passed = sol >= 3 || Boolean(stormLog);
  const size = STORM_SIZE[severity];
  const donki = useDonki(event);

  return (
    <section className="card storm" aria-labelledby="storm-title">
      <div className="storm__head">
        <h2 id="storm-title" className="storm__title">
          <span aria-hidden="true">☀</span> STORM FORECAST
        </h2>
        <span className="badge badge-real">
          🟦 {stormBadgeText(donki.origin)}
          {event?.date ? ` · ${event.date}` : ''}
        </span>
      </div>

      {passed ? (
        <p className="storm__line storm__passed">The storm has passed.</p>
      ) : (
        <p className="storm__line">
          Arrives at the <strong>END of SOL 2</strong>. Size: <strong className="storm__size">{size}</strong>
        </p>
      )}

      {event && (
        <p className="storm__line">
          Based on a real <strong>{event.classType}</strong> solar flare, {event.date}.
        </p>
      )}
      {donki.origin === 'api' && <DonkiDetails details={donki.details} />}

      {passed ? (
        <p className={`storm__status ${stormLog ? 'is-hit' : 'is-safe'}`}>
          {stormLog ? (
            <>
              <span aria-hidden="true">🌩</span> {stormLog.text}
            </>
          ) : (
            <>
              <span aria-hidden="true">☂</span> Your crew was sheltered. No harm.
            </>
          )}
        </p>
      ) : (
        <p className={`storm__status ${sheltered ? 'is-safe' : 'is-warn'}`}>
          Crew status:{' '}
          {sheltered ? (
            <strong>
              <span aria-hidden="true">☂</span> SHELTERED ✓
            </strong>
          ) : (
            <strong>
              <span aria-hidden="true">⚠</span> NOT SHELTERED yet
            </strong>
          )}
        </p>
      )}
    </section>
  );
}
