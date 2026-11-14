export default function Challenge({ state, dispatch, go, selectedChallenge }) {
  return (
    <div className="screen screen-challenge">
      <h1>Challenge ({selectedChallenge})</h1>
      <button onClick={() => go('solSummary')}>Continue</button>
    </div>
  );
}
