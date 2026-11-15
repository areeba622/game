import { ICON8, ICON8_COLORS } from '../pixel/icons8.js';

const cache = new Map();

// One <path> per colour key, horizontal runs merged.
function buildPaths(name) {
  if (cache.has(name)) return cache.get(name);
  const byKey = {};
  ICON8[name].forEach((row, y) => {
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
  const paths = Object.entries(byKey).map(([key, d]) => ({ key, d: d.join('') }));
  cache.set(name, paths);
  return paths;
}

// A small 8 x 8 pixel icon drawn at a whole-number scale. Decorative unless `label` is given.
export default function PxIcon({ name, scale = 2, label, className = '' }) {
  if (!ICON8[name]) return null;
  const size = 8 * scale;
  return (
    <svg
      className={`pxw-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {buildPaths(name).map(({ key, d }) => (
        <path key={key} d={d} fill={ICON8_COLORS[key]} />
      ))}
    </svg>
  );
}
