import { useState } from 'react';

export default function Callsign({ state, dispatch, go, startMission }) {
  const [nickname, setNickname] = useState('');

  return (
    <div className="screen screen-callsign">
      <h1>Callsign</h1>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button onClick={() => startMission(nickname)}>Continue</button>
    </div>
  );
}
