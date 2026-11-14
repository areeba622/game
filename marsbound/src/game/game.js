import { CHALLENGES } from './challenges.js';

const SOL_QUOTA = { 1: 2, 2: 2, 3: 1 };
const STORM_DAMAGE = { 1: 10, 2: 30, 3: 55 };
const RESOURCE_LABEL = { O: 'oxygen', W: 'water', P: 'power', C: 'crew health' };
const METER_LABEL = { O: 'Oxygen', W: 'Water', P: 'Power', C: 'Crew Health', S: 'Science' };

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function applyEffects(state, effects) {
  const next = { ...state };
  for (const [key, amount] of Object.entries(effects)) {
    next[key] = key === 'S' ? next[key] + amount : clamp(next[key] + amount);
  }
  return next;
}

function describeEffects(effects) {
  return Object.entries(effects)
    .map(([key, amount]) => `${METER_LABEL[key]} ${amount >= 0 ? '+' : ''}${amount}`)
    .join(', ');
}

function checkFailure(state) {
  if (state.phase !== 'active') return state;
  for (const key of ['O', 'W', 'P', 'C']) {
    if (state[key] === 0) {
      return { ...state, phase: 'failed', failReason: RESOURCE_LABEL[key] };
    }
  }
  return state;
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

export function choose(state, cid, opt) {
  if (state.phase !== 'active' || state.done[cid]) return state;

  const option = CHALLENGES[cid].options[opt];
  let next = applyEffects(state, option.effects);

  next.done = { ...state.done, [cid]: opt };
  next.history = [...state.history, { sol: state.sol, cid, opt }];
  next.doneThisSol = state.doneThisSol + 1;
  next.pending = [...state.pending];

  if (cid === 'R' && (opt === 'A' || opt === 'B') && (state.sol === 1 || state.sol === 2)) {
    next.sheltered = true;
  }

  if (option.later) {
    next.pending.push({ cid, effects: option.later });
  }

  next = checkFailure(next);

  return next;
}

export function solIsFinished(state) {
  return state.doneThisSol >= SOL_QUOTA[state.sol];
}

export function endSol(state) {
  let next = { ...state, log: [...state.log] };

  // 1. Storm (end of Sol 2 only)
  if (next.sol === 2 && !next.sheltered) {
    const damage = STORM_DAMAGE[next.severity];
    next.C = clamp(next.C - damage);
    next.log.push({ sol: next.sol, kind: 'storm', text: `A solar storm hit the crew! Crew Health -${damage}.` });
  }

  // 2. Upkeep (every Sol, including Sol 3)
  next.O = clamp(next.O - 8);
  next.W = clamp(next.W - 3);
  next.P = clamp(next.P - 3);
  next.log.push({ sol: next.sol, kind: 'upkeep', text: 'Nightly upkeep: Oxygen -8, Water -3, Power -3.' });

  // 3. Unfinished problems
  if (!next.done.L) {
    next.O = clamp(next.O - 8);
    next.log.push({ sol: next.sol, kind: 'penalty', text: 'Life Support was never fixed: Oxygen -8 more.' });
  }
  if (!next.done.W) {
    next.P = clamp(next.P - 4);
    next.log.push({ sol: next.sol, kind: 'penalty', text: 'Power Budget was never fixed: Power -4 more.' });
  }

  // 4. Failure check
  next = checkFailure(next);
  if (next.phase === 'failed') return next;

  // 5. End of Sol 3 means the mission is complete; otherwise just leave pending for the morning.
  if (next.sol === 3) {
    next.phase = 'complete';
  }

  return next;
}

export function startNextSol(state) {
  if (state.phase !== 'active' || state.sol >= 3) return state;

  let next = { ...state, log: [...state.log], pending: [] };

  for (const entry of state.pending) {
    next = applyEffects(next, entry.effects);
    const kind = entry.cid === 'G' ? 'harvest' : 'earthReply';
    const text = kind === 'harvest'
      ? `The greenhouse harvest arrived: ${describeEffects(entry.effects)}.`
      : `Earth's reply arrived: ${describeEffects(entry.effects)}.`;
    next.log.push({ sol: state.sol, kind, text });
  }

  next.sol = state.sol + 1;
  next.doneThisSol = 0;

  next = checkFailure(next);

  return next;
}

export function previewChoice(state, cid, opt) {
  let current = choose(state, cid, opt);
  let failed = current.phase === 'failed';
  let failReason = current.failReason;

  const includesNight = solIsFinished(current);
  if (includesNight) {
    current = endSol(current);
    if (current.phase === 'failed') {
      failed = true;
      failReason = current.failReason;
    }
  }

  const after = { O: current.O, W: current.W, P: current.P, C: current.C, S: current.S };
  const arriving = includesNight ? current.pending : [];

  if (!failed && current.phase === 'active' && current.sol < 3) {
    const tomorrow = startNextSol(current);
    if (tomorrow.phase === 'failed') {
      failed = true;
      failReason = tomorrow.failReason;
    }
  }

  return { after, includesNight, arriving, failed, failReason };
}

export function outcome(state) {
  const lowest = Math.min(state.O, state.W, state.P, state.C);

  if (lowest === 0) return { key: 'failed', label: 'Mission Failed' };
  if (lowest <= 19) return { key: 'atRisk', label: 'Mission at Risk' };
  if (lowest <= 39 || state.S < 15) return { key: 'withChallenges', label: 'Complete — With Challenges' };
  return { key: 'successful', label: 'Mission Successful' };
}

export function statusLabel(value) {
  if (value >= 70) return { word: 'Healthy', color: '#2ecc71', icon: '🟢' };
  if (value >= 40) return { word: 'OK', color: '#f1c40f', icon: '🟡' };
  if (value >= 20) return { word: 'Low', color: '#e67e22', icon: '🟠' };
  if (value >= 1) return { word: 'Critical', color: '#e74c3c', icon: '🔴' };
  return { word: 'Empty', color: '#555555', icon: '⚫' };
}
