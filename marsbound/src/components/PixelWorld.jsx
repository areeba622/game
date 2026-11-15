import { useEffect, useRef } from 'react';
import { createWorld } from '../pixel/world.js';

const TICK_MS = 1000 / 6; // stepped, sprite-like animation
const KEYS = ['o', 'w', 'p', 'c', 's'];

// Full-screen pixel canvas. Draws the station (view="dash") or a challenge scene (view="story").
// It only draws what it is told: values, done rooms, Sol, scene tone. It never changes game state.
//
// hudRef / footRef: the HUD at the top and the Mission Control / dialogue block at the bottom.
// The art is fitted between them. onLayout({ scale, rooms }) tells the screen where rooms sit.
export default function PixelWorld({ view, phase, values, done, plantTarget = 0, hover = null, storyId, res = 'intro', hudRef, footRef, onLayout }) {
  const canvasRef = useRef(null);
  const live = useRef({ view, phase, values, done, plantTarget, hover, storyId, res });
  const layoutCb = useRef(onLayout);

  // Keep the loop's view of the props current without restarting it.
  useEffect(() => {
    live.current = { view, phase, values, done, plantTarget, hover, storyId, res };
    layoutCb.current = onLayout;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const world = createWorld(canvas);
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const first = live.current;
    const sim = {
      tick: 0,
      phase: first.phase,
      prev: first.phase,
      trans: 1,
      shown: { ...first.values },
      plant: 0,
      rt: 0,
      lastRes: first.res,
    };
    let raf = 0;
    let last = 0;

    function doLayout() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const hud = hudRef?.current;
      const hudBottom = hud ? hud.offsetTop + hud.offsetHeight + 12 : 0;
      const footH = footRef?.current ? footRef.current.offsetHeight + 16 : 70;
      const geo = view === 'story' ? world.layoutStory(vw, vh, hudBottom, footH) : world.layoutDash(vw, vh, hudBottom, footH);
      layoutCb.current?.(geo);
      paint();
    }

    function step() {
      const cur = live.current;
      sim.tick += 1;
      if (cur.phase !== sim.phase) {
        sim.prev = sim.phase;
        sim.phase = cur.phase;
        sim.trans = reduced ? 1 : 0;
      }
      if (sim.trans < 1) sim.trans = Math.min(1, sim.trans + 0.125);
      KEYS.forEach((k) => {
        const target = cur.values?.[k] ?? 0;
        const d = target - sim.shown[k];
        sim.shown[k] += reduced || Math.abs(d) <= 2 ? d : Math.sign(d) * 2;
      });
      if (reduced) sim.plant = cur.plantTarget;
      else if (sim.plant < cur.plantTarget && sim.tick % 5 === 0) sim.plant += 1;
      else if (sim.plant > cur.plantTarget) sim.plant = cur.plantTarget;
      if (cur.res !== sim.lastRes) {
        sim.lastRes = cur.res;
        sim.rt = reduced && cur.res !== 'intro' ? 60 : 0;
      } else if (cur.res !== 'intro' && !reduced) sim.rt += 1;
    }

    function paint() {
      const cur = live.current;
      world.draw({
        view,
        phase: sim.phase,
        prev: sim.prev,
        trans: sim.trans,
        tick: sim.tick,
        reduced,
        shown: sim.shown,
        done: cur.done || {},
        plant: sim.plant,
        hover: cur.hover,
        storyId: cur.storyId,
        story: { res: cur.res, rt: sim.rt },
      });
    }

    function loop(t) {
      raf = requestAnimationFrame(loop);
      if (document.hidden || t - last < TICK_MS) return;
      last = t;
      step();
      paint();
    }

    doLayout();
    let timer = 0;
    if (reduced) {
      // No animation: a gentle redraw so changed values show up.
      timer = window.setInterval(() => {
        step();
        paint();
      }, 400);
    } else raf = requestAnimationFrame(loop);

    const onResize = () => doLayout();
    window.addEventListener('resize', onResize);
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onResize);
    if (ro) {
      if (hudRef?.current) ro.observe(hudRef.current);
      if (footRef?.current) ro.observe(footRef.current);
    }
    // Fonts load late and change the HUD height; measure again once they are ready.
    document.fonts?.ready?.then(doLayout);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(timer);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [view, hudRef, footRef]);

  return <canvas ref={canvasRef} className="pxw-canvas" aria-hidden="true" />;
}
