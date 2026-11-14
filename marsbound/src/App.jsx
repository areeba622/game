import { useReducer, useState } from 'react';
import { newGame, choose, endSol, startNextSol, solIsFinished } from './game/game.js';
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

  // After a choice has been dispatched and `state` reflects it: decide
  // whether the Sol is finished and where to go next (CLAUDE.md 5.10).
  function continueAfterResult() {
    if (state.phase !== 'active') {
      go('debrief');
      return;
    }

    if (solIsFinished(state)) {
      const next = endSol(state);
      dispatch({ type: 'END_SOL' });
      if (next.phase === 'failed') {
        go('debrief');
      } else {
        go('solSummary');
      }
      return;
    }

    go('dashboard');
  }

  // The Sol Summary screen's button: apply the morning, report what arrived.
  // If the mission already ended (Sol 3's night set phase to 'complete', or
  // the storm/upkeep set it to 'failed'), there is no morning to run.
  function startMorning() {
    if (state.phase === 'complete' || state.phase === 'failed') {
      go('debrief');
      return;
    }

    const morningState = startNextSol(state);
    dispatch({ type: 'START_SOL' });
    setMorningReport(morningState.log.slice(state.log.length));

    if (morningState.phase === 'failed') {
      go('debrief');
    } else {
      go('dashboard');
    }
  }

  function clearMorningReport() {
    setMorningReport(null);
  }

  function playAgain() {
    const event = pickStorm(spaceWeatherEvents);
    dispatch({ type: 'START', severity: event.severity, event, nickname: state.nickname });
    setSelectedChallenge(null);
    setMorningReport(null);
    go('intro');
  }

  function restart() {
    setSelectedChallenge(null);
    setMorningReport(null);
    go('callsign');
  }

  const actions = {
    startMission,
    continueAfterResult,
    startMorning,
    clearMorningReport,
    playAgain,
    restart,
  };

  const Screen = SCREENS[screen];

  return (
    <Screen
      state={state}
      dispatch={dispatch}
      go={go}
      selectedChallenge={selectedChallenge}
      morningReport={morningReport}
      actions={actions}
    />
  );
}
