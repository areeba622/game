import { useReducer, useState } from 'react';
import { newGame, choose, endSol, startNextSol } from './game/game.js';
import { pickStorm } from './game/storm.js';
import spaceWeatherEvents from './data/spaceWeatherEvents.json';

import Title from './screens/Title.jsx';
import Callsign from './screens/Callsign.jsx';
import Intro from './screens/Intro.jsx';
import Dashboard from './screens/Dashboard.jsx';
import Challenge from './screens/Challenge.jsx';
import SolSummary from './screens/SolSummary.jsx';
import Debrief from './screens/Debrief.jsx';
import Sources from './screens/Sources.jsx';

const SCREENS = {
  title: Title,
  callsign: Callsign,
  intro: Intro,
  dashboard: Dashboard,
  challenge: Challenge,
  solSummary: SolSummary,
  debrief: Debrief,
  sources: Sources,
};

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...newGame(action.severity), event: action.event, nickname: action.nickname };
    case 'CHOOSE':
      return choose(state, action.cid, action.opt);
    case 'END_SOL':
      return endSol(state);
    case 'START_SOL':
      return startNextSol(state);
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, newGame(1));
  const [screen, setScreen] = useState('title');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [morningReport, setMorningReport] = useState(null);

  function go(screenName, payload) {
    if (screenName === 'challenge') {
      setSelectedChallenge(payload ?? null);
    }
    setScreen(screenName);
  }

  function startMission(nickname) {
    const event = pickStorm(spaceWeatherEvents);
    dispatch({ type: 'START', severity: event.severity, event, nickname });
    go('intro');
  }

  const Screen = SCREENS[screen];
  const extraProps = screen === 'callsign' ? { startMission } : {};

  return (
    <Screen
      state={state}
      dispatch={dispatch}
      go={go}
      selectedChallenge={selectedChallenge}
      morningReport={morningReport}
      {...extraProps}
    />
  );
}
