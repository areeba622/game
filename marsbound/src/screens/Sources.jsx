// Placeholder. Click-through only; real sources list comes later.

export default function Sources({ state, dispatch, go }) {
  return (
    <div className="screen screen-sources">
      <h1>Sources</h1>
      <button onClick={() => go('title')}>Back</button>
    </div>
  );
}
