// NASA's own record of the flare, shown only when DONKI answered.
// Labels are NASA's; nothing is explained or invented here.
function formatTime(t) {
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})Z$/.exec(t ?? '');
  return m ? `${m[1]} ${m[2]} UTC` : t;
}

export default function DonkiDetails({ details }) {
  if (!details) return null;
  const rows = [
    ['Peak time', details.peakTime && formatTime(details.peakTime)],
    ['Flare location (NASA code)', details.sourceLocation],
    ['Active region number', details.activeRegionNum],
    ['Measured by', details.instrument],
  ].filter(([, value]) => value !== null && value !== undefined && value !== '');

  return (
    <details className="donki">
      <summary>NASA's record of this flare</summary>
      <ul className="donki__list">
        {rows.map(([label, value]) => (
          <li key={label}>
            {label}: <strong>{value}</strong>
          </li>
        ))}
        {details.link && (
          <li>
            <a href={details.link} target="_blank" rel="noopener noreferrer">
              Open this record on NASA's DONKI
            </a>
          </li>
        )}
      </ul>
      <p className="donki__note">
        Real data from NASA's DONKI archive. The storm damage in the game is a game number.
      </p>
    </details>
  );
}
