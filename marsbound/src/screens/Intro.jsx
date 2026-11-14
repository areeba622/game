export default function Intro({ state, dispatch, go }) {
  console.log('state.event =', state.event);

  return (
    <div className="screen screen-intro">
      <h1>Intro</h1>
      <button onClick={() => go('dashboard')}>Continue</button>
    </div>
  );
}
