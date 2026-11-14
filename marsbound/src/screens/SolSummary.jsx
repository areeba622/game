export default function SolSummary({ state, dispatch, go }) {
  return (
    <div className="screen screen-sol-summary">
      <h1>Sol Summary</h1>
      <button onClick={() => go('debrief')}>Continue</button>
    </div>
  );
}
