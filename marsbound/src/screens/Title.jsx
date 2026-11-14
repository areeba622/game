export default function Title({ state, dispatch, go }) {
  return (
    <div className="screen screen-title">
      <h1>Title</h1>
      <button onClick={() => go('callsign')}>Start Mission</button>
      <button onClick={() => go('sources')}>Sources</button>
    </div>
  );
}
