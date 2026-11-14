export default function Debrief({ state, dispatch, go, actions }) {
  return (
    <div className="screen screen-debrief">
      <h1>Debrief</h1>
      <button onClick={() => actions.playAgain()}>Play Again</button>
      <button onClick={() => actions.restart()}>Restart</button>
    </div>
  );
}
