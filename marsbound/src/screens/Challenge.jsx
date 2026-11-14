import { useEffect, useState } from 'react';

export default function Challenge({ state, dispatch, go, selectedChallenge, actions }) {
  const [awaitingResult, setAwaitingResult] = useState(false);

  function handleChoose() {
    dispatch({ type: 'CHOOSE', cid: selectedChallenge, opt: 'A' });
    setAwaitingResult(true);
  }

  // Waits for the CHOOSE dispatch above to land in `state` (next render)
  // before asking App.jsx to decide where to go next.
  useEffect(() => {
    if (awaitingResult) {
      setAwaitingResult(false);
      actions.continueAfterResult();
    }
  }, [state, awaitingResult, actions]);

  return (
    <div className="screen screen-challenge">
      <h1>Challenge ({selectedChallenge})</h1>
      <button onClick={handleChoose}>Continue</button>
    </div>
  );
}
