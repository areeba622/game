import { useMemo } from 'react';
import { ASTRO, ICONS, MCG, PAL, PALS } from './pixelData.js';

// Pixel components: sprites built from character grids, small icons, astronauts and portraits.

// Sprite: a grid of characters turned into one SVG. Same-colour runs are merged.
export function Sprite({ grid, scale = 3, pal = PAL, className = '' }) {
  const { w, h, paths } = useMemo(() => {
    const height = grid.length;
    const width = Math.max(...grid.map((r) => r.length));
    const byColor = {};
    grid.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const ch = row[x];
        if (!pal[ch]) {
          x += 1;
          continue;
        }
        let e = x;
        while (e < row.length && row[e] === ch) e += 1;
        (byColor[pal[ch]] ??= []).push(`M${x} ${y}h${e - x}v1h-${e - x}z`);
        x = e;
      }
    });
    return { w: width, h: height, paths: Object.entries(byColor) };
  }, [grid, pal]);

  return (
    <svg
      className={`pi-spr ${className}`.trim()}
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map(([color, d]) => (
        <path key={color} d={d.join('')} fill={color} />
      ))}
    </svg>
  );
}

export const Ico = ({ n, s = 3 }) => <Sprite grid={ICONS[n]} scale={s} />;

export function Portrait({ who, size }) {
  if (who === 'mc') return <Sprite grid={MCG} scale={size ?? 5} />;
  return <Sprite grid={ASTRO.slice(0, 12)} scale={size ?? 6} pal={PALS[who]} />;
}

export const Astronaut = ({ who, scale = 5 }) => <Sprite grid={ASTRO} scale={scale} pal={PALS[who]} />;

