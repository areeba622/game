import { describe, it, expect } from 'vitest';
import { newGame, choose, endSol, startNextSol } from './game.js';

describe('newGame', () => {
  it('starts with the values from CLAUDE.md 5.7', () => {
    const s = newGame(2);
    expect(s.O).toBe(75);
    expect(s.W).toBe(70);
    expect(s.P).toBe(80);
    expect(s.C).toBe(75);
    expect(s.S).toBe(0);
    expect(s.sol).toBe(1);
    expect(s.history).toEqual([]);
    expect(s.phase).toBe('active');
  });
});

describe('storm and shelter', () => {
  it('Radiation A on Sol 1: the night of Sol 2 does not reduce Crew Health', () => {
    let s = newGame(1);
    s = choose(s, 'R', 'A');
    s = choose(s, 'L', 'A');
    s = endSol(s); // Sol 1 night
    s = startNextSol(s); // -> Sol 2

    const cBeforeNight = s.C;
    s = endSol(s); // Sol 2 night

    expect(s.sheltered).toBe(true);
    expect(s.C).toBe(cBeforeNight);
  });

  it('Radiation never done, severity 3: Crew Health drops by 55 on the night of Sol 2', () => {
    let s = newGame(3);
    s = choose(s, 'L', 'A');
    s = choose(s, 'W', 'C');
    s = endSol(s); // Sol 1 night
    s = startNextSol(s); // -> Sol 2
    s = choose(s, 'G', 'B');
    s = choose(s, 'R', 'C'); // Radiation C never shelters

    const cBeforeNight = s.C;
    s = endSol(s); // Sol 2 night: storm hits

    expect(s.sheltered).toBe(false);
    expect(s.C).toBe(cBeforeNight - 55);
  });
});

describe('Greenhouse harvest timing', () => {
  it('Greenhouse A on Sol 1: harvest stays pending after endSol, arrives after startNextSol', () => {
    let s = newGame(1);
    s = choose(s, 'G', 'A');
    s = choose(s, 'L', 'B');
    s = endSol(s); // Sol 1 night

    expect(s.pending).toHaveLength(1);
    expect(s.pending[0].cid).toBe('G');

    const oBeforeMorning = s.O;
    const cBeforeMorning = s.C;
    s = startNextSol(s);

    expect(s.O).toBe(oBeforeMorning + 10);
    expect(s.C).toBe(cBeforeMorning + 10);
    expect(s.pending).toHaveLength(0);
  });
});

describe('Earth reply timing', () => {
  it('Earth A on Sol 1: reply stays pending after endSol, Power +6 arrives on Sol 2', () => {
    let s = newGame(1);
    s = choose(s, 'M', 'A');
    s = choose(s, 'L', 'B');
    s = endSol(s); // Sol 1 night

    expect(s.pending).toHaveLength(1);
    expect(s.pending[0].cid).toBe('M');

    const pBeforeMorning = s.P;
    s = startNextSol(s);

    expect(s.P).toBe(pBeforeMorning + 6);
    expect(s.sol).toBe(2);
  });

  it('Earth A on Sol 3: the +6 reply never arrives, phase becomes complete', () => {
    let s = newGame(2);
    s = choose(s, 'L', 'C');
    s = choose(s, 'R', 'A');
    s = endSol(s);
    s = startNextSol(s);
    s = choose(s, 'W', 'A');
    s = choose(s, 'G', 'A');
    s = endSol(s);
    s = startNextSol(s);

    s = choose(s, 'M', 'A');
    const pBeforeNight = s.P;
    s = endSol(s); // Sol 3 night: mission ends here

    expect(s.phase).toBe('complete');
    // upkeep (-3) ran, but the +6 reply never applied
    expect(s.P).toBe(pBeforeNight - 3);
    expect(s.pending.some((p) => p.cid === 'M')).toBe(true);
  });

  it('Earth reply C with Power at 8 after the night: startNextSol ends the mission', () => {
    let s = newGame(1);
    s.P = 17; // forced so Power lands at exactly 8 after choices + night
    s = choose(s, 'M', 'C'); // P -2 -> 15
    s = choose(s, 'G', 'B'); // finishes Sol 1 quota without touching Power

    s = endSol(s); // Sol 1 night: upkeep -3, Power Budget unfinished -4 more -> 8
    expect(s.P).toBe(8);
    expect(s.phase).toBe('active');

    s = startNextSol(s); // applies Earth reply: Power -8 -> 0

    expect(s.phase).toBe('failed');
    expect(s.failReason).toBe('power');
  });
});

describe('history', () => {
  it('records {sol, cid, opt} for each choice', () => {
    let s = newGame(1);
    s = choose(s, 'L', 'A');
    s = choose(s, 'R', 'B');

    expect(s.history).toEqual([
      { sol: 1, cid: 'L', opt: 'A' },
      { sol: 1, cid: 'R', opt: 'B' },
    ]);
  });
});

describe('worked example, CLAUDE.md 5.9 (severity 2)', () => {
  it('matches every step of the table', () => {
    let s = newGame(2);
    expect(s).toMatchObject({ O: 75, W: 70, P: 80, C: 75, S: 0, sol: 1 });

    // Sol 1: Life Support C, Radiation A
    s = choose(s, 'L', 'C');
    s = choose(s, 'R', 'A');
    s = endSol(s);
    expect(s).toMatchObject({ O: 77, W: 58, P: 59, C: 78, S: 2 });

    // Morning
    s = startNextSol(s);
    expect(s).toMatchObject({ O: 77, W: 58, P: 59, C: 78, S: 2, sol: 2 });

    // Sol 2: Power A, Greenhouse A
    s = choose(s, 'W', 'A');
    s = choose(s, 'G', 'A');
    s = endSol(s);
    expect(s).toMatchObject({ O: 73, W: 43, P: 36, C: 82, S: 10 });

    // Morning
    s = startNextSol(s);
    expect(s).toMatchObject({ O: 83, W: 43, P: 36, C: 92, S: 10, sol: 3 });

    // Sol 3: Earth A
    s = choose(s, 'M', 'A');
    s = endSol(s);
    expect(s).toMatchObject({ O: 75, W: 40, P: 28, C: 95, S: 10, phase: 'complete' });
  });

  it('matches the Earth+Greenhouse-on-Sol-2 variant from the notes', () => {
    let s = newGame(2);
    s = choose(s, 'L', 'C');
    s = choose(s, 'R', 'A');
    s = endSol(s);
    s = startNextSol(s);

    // Sol 2: Earth A, Greenhouse A
    s = choose(s, 'M', 'A');
    s = choose(s, 'G', 'A');
    s = endSol(s);
    expect(s).toMatchObject({ O: 69, W: 43, P: 33, C: 81, S: 10 });

    s = startNextSol(s);
    expect(s).toMatchObject({ O: 79, W: 43, P: 39, C: 91, S: 10, sol: 3 });

    // Sol 3: Power A
    s = choose(s, 'W', 'A');
    s = endSol(s);
    expect(s).toMatchObject({ O: 75, W: 40, P: 30, C: 95, S: 10, phase: 'complete' });
  });
});

describe('choose guards', () => {
  it('choosing an already-done challenge returns the same state unchanged', () => {
    const s = newGame(1);
    const s1 = choose(s, 'L', 'A');
    const s2 = choose(s1, 'L', 'B');

    expect(s2).toBe(s1);
  });
});
