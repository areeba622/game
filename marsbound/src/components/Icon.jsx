import { PIXEL_MAPS } from './icons/pixelMaps.js';

const SCALES = [1, 2, 3, 4];
const cache = new Map();

// Merge each row into horizontal runs, one <path> per palette key.
function buildPaths(name) {
  if (cache.has(name)) return cache.get(name);
  const { palette, rows } = PIXEL_MAPS[name];
  const byKey = {};
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.') {
        x += 1;
        continue;
      }
      let w = 1;
      while (row[x + w] === ch) w += 1;
      (byKey[ch] ??= []).push(`M${x} ${y}h${w}v1h-${w}z`);
      x += w;
    }
  });
  const paths = Object.entries(byKey).map(([key, d]) => ({ key, token: palette[key], d: d.join('') }));
  cache.set(name, paths);
  return paths;
}

// A drawn 16x16 pixel icon, shown at an integer scale (1-4, default 2 = 32px).
// Decorative by default (aria-hidden). Pass `label` when the icon is the only signal.
export default function Icon({ name, scale = 2, label, className = '' }) {
  if (!PIXEL_MAPS[name]) return null;
  const s = SCALES.includes(scale) ? scale : 2;
  const size = 16 * s;

  return (
    <svg
      className={`mb-icon mb-pixel ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {buildPaths(name).map(({ key, token, d }) => (
        <path key={key} d={d} fill={`var(--color-${token})`} />
      ))}
    </svg>
  );
}
