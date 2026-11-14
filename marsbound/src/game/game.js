import { CHALLENGES } from './challenges.js';

const SOL_QUOTA = { 1: 2, 2: 2, 3: 1 };

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

export function newGame(severity) {
  return {
    sol: 1,
    O: 75,
    W: 70,
    P: 80,
    C: 75,
    S: 0,
    done: {},
    history: [],
    doneThisSol: 0,
    sheltered: false,
    pending: [],
    severity,
    event: null,
    nickname: 'Commander',
    phase: 'active',
    failReason: null,
    log: [],
  };
}

// STUB: applies effects only; does not queue "later" effects, check sheltering,
// or run any failure check yet.
export function choose(state, cid, opt) {
  if (state.phase !== 'active' || state.done[cid]) return state;

  const option = CHALLENGES[cid].options[opt];
  const next = { ...state, done: { ...state.done } };

  for (const [key, amount] of Object.entries(option.effects)) {
    next[key] = key === 'S' ? next[key] + amount : clamp(next[key] + amount);
  }

  next.done[cid] = opt;
  next.history = [...state.history, { sol: state.sol, cid, opt }];
  next.doneThisSol = state.doneThisSol + 1;

  return next;
}

export function solIsFinished(state) {
  return state.doneThisSol >= SOL_QUOTA[state.sol];
}

// STUB: does not run the storm, upkeep, unfinished-problem penalties, or the
// real failure check yet.
export function endSol(state) {
  if (state.sol === 3) {
    return { ...state, phase: 'complete' };
  }
  return state;
}

// STUB: does not apply pending effects or run the failure check yet.
export function startNextSol(state) {
  return { ...state, sol: state.sol + 1, doneThisSol: 0 };
}

// STUB: only applies the chosen option's effects; ignores night effects,
// "later" arrivals, and failure detection.
export function previewChoice(state, cid, opt) {
  const option = CHALLENGES[cid].options[opt];
  const after = { O: state.O, W: state.W, P: state.P, C: state.C, S: state.S };

  for (const [key, amount] of Object.entries(option.effects)) {
    after[key] = key === 'S' ? after[key] + amount : clamp(after[key] + amount);
  }

  return {
    after,
    includesNight: false,
    arriving: [],
    failed: false,
    failReason: null,
  };
}

// STUB: always reports the same outcome regardless of state.
export function outcome(state) {
  return { key: 'withChallenges', label: 'Complete — With Challenges' };
}

export function statusLabel(value) {
  if (value >= 70) return { word: 'Healthy', color: '#2ecc71', icon: '🟢' };
  if (value >= 40) return { word: 'OK', color: '#f1c40f', icon: '🟡' };
  if (value >= 20) return { word: 'Low', color: '#e67e22', icon: '🟠' };
  if (value >= 1) return { word: 'Critical', color: '#e74c3c', icon: '🔴' };
  return { word: 'Empty', color: '#555555', icon: '⚫' };
}
