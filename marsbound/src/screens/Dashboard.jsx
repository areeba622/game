export default function Dashboard({ state, dispatch, go }) {
  return (
    <div className="screen screen-dashboard">
      <h1>Dashboard</h1>
      <button onClick={() => go('challenge', 'L')}>Open Challenge</button>
    </div>
  );
}
