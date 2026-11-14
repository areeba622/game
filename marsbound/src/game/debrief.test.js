import { describe, it, expect } from 'vitest';
import { newGame, choose, endSol, startNextSol } from './game.js';
import { buildDebrief } from './debrief.js';

describe('buildDebrief', () => {
  it('includes the sheltered line when Radiation A was chosen on Sol 1', () => {
    let s = newGame(1);
    s = choose(s, 'R', 'A');
    s = choose(s, 'L', 'A');
    s = endSol(s);

    const debrief = buildDebrief(s);

    expect(debrief.good).toContain('You protected the crew before the storm.');
  });

  it('includes "the reply came after the mission" when Earth was done on Sol 3', () => {
    let s = newGame(2);
    s = choose(s, 'L', 'C');
    s = choose(s, 'R', 'A');
    s = endSol(s);
    s = startNextSol(s);
    s = choose(s, 'W', 'A');
    s = choose(s, 'G', 'A');
    s = endSol(s);
    s = startNextSol(s);
    s = choose(s, 'M', 'A'); // Sol 3
    s = endSol(s);

    const debrief = buildDebrief(s);

    expect(debrief.better).toContain('The reply came after the mission. Send messages early.');
  });

  it('includes "plants did not have time to grow" when Greenhouse was done on Sol 3', () => {
    let s = newGame(1);
    s = choose(s, 'L', 'A');
    s = choose(s, 'R', 'A');
    s = endSol(s);
    s = startNextSol(s);
    s = choose(s, 'W', 'A');
    s = choose(s, 'M', 'A');
    s = endSol(s);
    s = startNextSol(s);
    s = choose(s, 'G', 'B'); // Sol 3
    s = endSol(s);

    const debrief = buildDebrief(s);

    expect(debrief.better).toContain('Plants did not have time to grow.');
  });

  it('tip names the lowest meter when it is below 40', () => {
    const s = { ...newGame(1), O: 83, W: 50, P: 35, C: 90 };

    const debrief = buildDebrief(s);

    expect(debrief.tip).toBe('Your lowest meter was Power (35).');
  });
});
