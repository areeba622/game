import { useEffect, useRef } from 'react';
import { C } from '../pixel/world.js';

// Stepped-circle clip so the portrait is a pixel circle, not a smooth one.
function pixCircle(n) {
  const r = n / 2;
  const hw = [];
  for (let j = 0; j < n; j++) {
    const y = j + 0.5 - r;
    hw.push(Math.round(Math.sqrt(Math.max(0, r * r - y * y))));
  }
  const pc = (v) => `${((v / n) * 100).toFixed(2)}%`;
  const pts = [];
  for (let j = 0; j < n; j++) pts.push(`${pc(r + hw[j])} ${pc(j)}`, `${pc(r + hw[j])} ${pc(j + 1)}`);
  for (let j = n - 1; j >= 0; j--) pts.push(`${pc(r - hw[j])} ${pc(j + 1)}`, `${pc(r - hw[j])} ${pc(j)}`);
  return `polygon(${pts.join(',')})`;
}
const CLIP = pixCircle(26);

// Mission Control's face: a tiny astronaut drawn on a 16 x 16 pixel canvas.
export default function MissionPortrait() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current.getContext('2d');
    const r = (x, y, w, h, col) => {
      c.fillStyle = col;
      c.fillRect(x, y, w, h);
    };
    r(0, 0, 16, 16, '#000');
    r(5, 1, 6, 1, C.navy);
    r(4, 2, 8, 9, C.navy);
    r(5, 2, 6, 8, C.bone);
    r(5, 4, 6, 4, '#2a6fa8');
    r(9, 4, 2, 1, C.lcyan);
    r(3, 5, 1, 3, C.orange);
    r(12, 5, 1, 3, C.orange);
    r(12, 8, 2, 1, C.orange);
    r(13, 8, 1, 3, C.orange);
    r(3, 11, 10, 5, C.navy);
    r(4, 11, 8, 5, C.bone);
    r(7, 12, 2, 3, C.cyan);
  }, []);
  return <canvas ref={ref} width="16" height="16" className="pxw-portrait" style={{ clipPath: CLIP }} aria-hidden="true" />;
}
