export default function SolSummary({ state, dispatch, go, morningReport, actions }) {
  return (
    <div className="screen screen-sol-summary">
      <h1>Sol Summary</h1>
      <button onClick={() => actions.startMorning()}>
        {state.phase === 'complete' ? 'See Mission Debrief' : 'Start next Sol'}
      </button>
    </div>
  );
}
