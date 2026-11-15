import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ICON_NAMES, PIXEL_MAPS } from './pixelMaps.js';

const themeCss = readFileSync(fileURLToPath(new URL('../../styles/theme.css', import.meta.url)), 'utf8');
const tokens = new Set([...themeCss.matchAll(/--color-([a-z0-9-]+):/g)].map((m) => m[1]));

const STATUS = ['status-healthy', 'status-ok', 'status-low', 'status-critical', 'status-empty'];
const ART_ONLY = ['mid-slate', 'green-deep', 'shadow-warm', 'shadow-neutral'];
// green-bright is the Healthy token but is also the plant colour (STYLE.md green ramp).
const GREEN_ALLOWED = ['plant', 'greenhouse', 'status-healthy'];

const tokensOf = (name) => Object.values(PIXEL_MAPS[name].palette);
const silhouette = (name) => PIXEL_MAPS[name].rows.map((r) => r.replace(/[^.]/g, '#')).join('');

describe('pixel icon maps', () => {
  it('has the 34 icons', () => {
    expect(ICON_NAMES).toHaveLength(34);
  });

  it.each(ICON_NAMES)('%s is 16x16 and only uses its palette keys', (name) => {
    const { rows, palette } = PIXEL_MAPS[name];
    expect(rows).toHaveLength(16);
    rows.forEach((row) => expect(row).toHaveLength(16));
    const used = new Set(rows.join('').replace(/\./g, ''));
    used.forEach((ch) => expect(Object.keys(palette)).toContain(ch));
    Object.keys(palette).forEach((key) => expect([...used]).toContain(key));
  });

  it.each(ICON_NAMES)('%s uses at most 4 valid tokens', (name) => {
    const list = tokensOf(name);
    expect(list.length).toBeLessThanOrEqual(4);
    list.forEach((token) => expect(tokens.has(token), `unknown token ${token}`).toBe(true));
  });

  it.each(ICON_NAMES)('%s follows the colour rules', (name) => {
    const list = tokensOf(name);
    expect(list).not.toContain('accent-signal');
    ART_ONLY.forEach((token) => expect(list).not.toContain(token));
    if (!name.startsWith('status-')) {
      STATUS.forEach((status) => expect(list).not.toContain(status));
    }
    if (!GREEN_ALLOWED.includes(name)) expect(list).not.toContain('green-bright');
  });

  it('gives every status icon its own status colour and a different shape', () => {
    STATUS.forEach((name) => expect(tokensOf(name)).toContain(name));
    const shapes = STATUS.map(silhouette);
    expect(new Set(shapes).size).toBe(5);
  });

  it('outlines Critical and Empty with text-primary', () => {
    expect(tokensOf('status-critical')).toContain('text-primary');
    expect(tokensOf('status-empty')).toContain('text-primary');
  });
});
