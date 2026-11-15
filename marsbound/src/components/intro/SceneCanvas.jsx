import { useEffect, useRef } from 'react';
import { drawScene, SCENE_W, SCENE_H } from './scenes.js';
import { useReducedMotion } from './useReducedMotion.js';

const REDRAW_MS = 280; // about three redraws a second: slow and steady, like sprites

// One pixel scene. It redraws only while it is the active one, and stops when removed.
// With reduced motion it is drawn once (and again when it becomes the active scene).
export default function SceneCanvas({ name, active = true, className = '' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    let tick = 0;
    drawScene(ctx, name, tick);
    if (reduced || !active) return undefined;
    const id = window.setInterval(() => {
      tick += 1;
      drawScene(ctx, name, tick);
    }, REDRAW_MS);
    return () => window.clearInterval(id);
  }, [name, active, reduced]);

  return <canvas ref={ref} className={`pi-scn ${className}`.trim()} width={SCENE_W} height={SCENE_H} aria-hidden="true" />;
}
