import { useEffect, useRef } from 'react';

// Challenge picker for the Dashboard — the Mars base on the surface, in pixel art.
// Wide screens: a Martian landscape (200x100 logical pixels) with five structures.
// Phones: a plain manifest list (same data, same onSelect).
//
// items: [{ id, title, short, warning, doneOption }]   onSelect(id)

const KINDS = ['life', 'shelter', 'power', 'comms', 'greenhouse'];

// col: column 0-4 · b: base height above the scene floor in % (far structures sit higher)
// bt: where the warning beacon floats, as % of the station canvas height
const SPOT = {
  life: { col: 0, b: 24, bt: 8 },
  shelter: { col: 1, b: 38, bt: 26 },
  power: { col: 2, b: 24, bt: 50 },
  comms: { col: 3, b: 40, bt: 30 },
  greenhouse: { col: 4, b: 24, bt: 34 },
};

function kindOf(title = '', i) {
  const t = title.toLowerCase();
  if (/life|oxygen/.test(t)) return 'life';
  if (/radiat|shelter/.test(t)) return 'shelter';
  if (/power|energy/.test(t)) return 'power';
  if (/green|plant/.test(t)) return 'greenhouse';
  if (/earth|comm/.test(t)) return 'comms';
  return KINDS[i % KINDS.length];
}

/* ---------- one shared animation clock for every canvas ---------- */
const subs = new Set();
let raf = 0;
let reduced = false;
function loop(ms) {
  subs.forEach((f) => f(reduced ? 0 : ms / 1000));
  raf = requestAnimationFrame(loop);
}
function useTick(fn) {
  const ref = useRef(fn);
  useEffect(() => { ref.current = fn; });
  useEffect(() => {
    reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const f = (t) => ref.current(t);
    subs.add(f);
    if (subs.size === 1) raf = requestAnimationFrame(loop);
    return () => {
      subs.delete(f);
      if (!subs.size) cancelAnimationFrame(raf);
    };
  }, []);
}

/* ---------- tiny pixel toolkit ---------- */
const INK = '#05090c';
const R = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
const P = (c, x, y, col) => R(c, x, y, 1, 1, col);
const shadow = (c) => { c.globalAlpha = 0.4; R(c, 0, 37, 34, 2, INK); c.globalAlpha = 1; };

// A half-ellipse shell (dome / arch) with a dark outline and four colour bands.
function shell(c, cx, cy, rx, ry, bands) {
  const inside = (x, y) => y <= cy && ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
  for (let y = Math.floor(cy - ry); y <= cy; y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
    if (!inside(x, y)) continue;
    if (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1)) { P(c, x, y, INK); continue; }
    const k = (y - (cy - ry)) / ry;
    P(c, x, y, k < 0.3 ? bands[0] : k < 0.6 ? bands[1] : k < 0.85 ? bands[2] : bands[3]);
  }
  return inside;
}
const press = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
};
const blink = (t, on, off) => (Math.floor(t * 2) % 2 ? on : off);

/* ---------- structures: 36 x 40 pixels, sun on the right ---------- */
function life(c, t) {
  shadow(c);
  const inside = shell(c, 18, 31, 15, 20, ['#a8efe6', '#7fd8d0', '#4fb8b0', '#2f8a88']);
  c.globalAlpha = 0.45;
  for (let y = 13; y <= 30; y++) if (inside(18, y) && inside(18, y - 1)) P(c, 18, y, '#e8fffb');
  c.globalAlpha = 1;
  [[8, 23], [8, 22], [9, 20], [10, 18], [12, 16], [14, 14]].forEach(([x, y]) => P(c, x, y, '#fff'));
  R(c, 13, 20, 10, 11, INK); R(c, 14, 21, 8, 10, '#e8dccd'); R(c, 14, 25, 8, 1, '#e2793a');
  for (let k = 0; k < 3; k++) P(c, 15 + k * 3, 19 - Math.floor((t * 4 + k * 5) % 8), '#fff');
  R(c, 1, 31, 34, 6, INK); R(c, 2, 32, 32, 4, '#b9a89a'); R(c, 2, 32, 32, 1, '#e8dccd'); R(c, 2, 35, 32, 1, '#8a7a70');
  R(c, 15, 32, 6, 4, '#4a2a30');
  R(c, 18, 6, 1, 5, '#4a2a30'); P(c, 18, 5, blink(t, '#ff5a4a', '#7a2a24'));
}

function shelter(c, t) {
  shadow(c);
  for (let y = 22; y <= 37; y++) {
    const d = Math.round((y - 22) * 5 / 15), l = 7 - d, r = 28 + d;
    R(c, l, y, r - l + 1, 1, '#b9a89a'); R(c, r - 6, y, 6, 1, '#ece1d3'); P(c, l, y, INK); P(c, r, y, INK);
  }
  R(c, 5, 19, 26, 4, INK); R(c, 6, 20, 24, 2, '#4a2a30'); R(c, 6, 20, 24, 1, '#6a4a50');
  for (let y = 27; y <= 29; y++) for (let x = 9; x <= 26; x++) P(c, x, y, ((x + y) >> 1) % 2 ? '#ffc93c' : INK);
  R(c, 14, 30, 8, 8, INK); R(c, 15, 31, 6, 7, '#2a1a22'); R(c, 16, 32, 4, 2, '#ffd45a');
  R(c, 8, 32, 3, 3, '#ffc93c'); P(c, 9, 33, INK); R(c, 25, 32, 3, 3, '#ffc93c'); P(c, 26, 33, INK);
  R(c, 24, 13, 1, 6, '#4a2a30'); P(c, 24, 12, blink(t, '#ff5a4a', '#7a2a24'));
}

function power(c, t) {
  shadow(c);
  [0, 12, 24].forEach((px) => {
    R(c, px + 4, 29, 2, 7, '#4a2a30');
    for (let r = 0; r < 7; r++) {
      const x0 = px + Math.round((6 - r) * 0.5), y = 22 + r;
      R(c, x0, y, 9, 1, r === 0 ? '#c8b8e8' : r % 2 ? '#3a2c80' : '#2a2060');
      P(c, x0, y, '#c8b8e8'); P(c, x0 + 8, y, '#6a58b8');
      if (r > 0) { P(c, x0 + 3, y, '#6a58b8'); P(c, x0 + 6, y, '#6a58b8'); }
    }
    P(c, px + 3, 24, '#8a78d8');
  });
  R(c, 13, 31, 10, 6, INK); R(c, 14, 32, 8, 4, '#e8dccd');
  P(c, 19, 32, '#e2793a'); P(c, 18, 33, '#e2793a'); P(c, 19, 34, '#e2793a'); P(c, 18, 35, '#e2793a');
  P(c, 15, 32, blink(t, '#7dff9a', '#2a6a3a'));
}

function comms(c, t) {
  shadow(c);
  R(c, 15, 26, 3, 12, '#b9a89a'); R(c, 17, 26, 1, 12, '#ece1d3');
  R(c, 12, 35, 9, 3, '#8a7a70'); R(c, 12, 35, 9, 1, '#b9a89a');
  const co = Math.cos(0.5), si = Math.sin(0.5), pts = [];
  for (let dy = -11; dy <= 11; dy++) for (let dx = -11; dx <= 11; dx++) {
    const u = dx * co + dy * si, v = -dx * si + dy * co;
    if (v < 0 || v > 5.2) continue;
    const e = (u / 9.5) ** 2 + (v / 5.2) ** 2;
    if (e <= 1) pts.push([dx, dy, e > 0.72, v > 3.6]);
  }
  pts.forEach(([dx, dy]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => P(c, 18 + dx + a, 21 + dy + b, INK)));
  pts.forEach(([dx, dy, rim, under]) => P(c, 18 + dx, 21 + dy, under ? '#8a7a70' : rim ? '#fff4e6' : '#d9cfc2'));
  for (let k = 1; k <= 7; k++) P(c, Math.round(18 + 0.48 * k), Math.round(21 - 0.88 * k), '#4a2a30');
  P(c, 21, 14, blink(t, '#ff5a4a', '#7a2a24'));
}

function greenhouse(c, t) {
  shadow(c);
  const inside = shell(c, 18, 32, 16, 17, ['#b8f5c4', '#8fe0a8', '#6bc88a', '#4aa86a']);
  c.globalAlpha = 0.5;
  [9, 18, 27].forEach((x) => { for (let y = 17; y <= 31; y++) if (inside(x, y) && inside(x, y - 1)) P(c, x, y, '#eafff0'); });
  c.globalAlpha = 1;
  [6, 12, 18, 24, 30].forEach((x, i) => {
    const sw = Math.sin(t * 1.2 + i * 1.7) > 0.6 ? 1 : 0;
    R(c, x, 28, 1, 4, '#1a5a2c');
    P(c, x - 1 + sw, 27, '#1f7a3a'); P(c, x + 1 + sw, 27, '#1f7a3a'); P(c, x + sw, 26, '#1f7a3a');
    if (i % 2 === 0) P(c, x + 1, 30, '#cc4630');
  });
  [[7, 24], [8, 22], [10, 20], [12, 19]].forEach(([x, y]) => P(c, x, y, '#fff'));
  R(c, 0, 32, 36, 5, INK); R(c, 1, 33, 34, 3, '#b9a89a'); R(c, 1, 33, 34, 1, '#e8dccd'); R(c, 1, 35, 34, 1, '#8a7a70');
}

const STRUCTURES = { life, shelter, power, comms, greenhouse };

function Pixel({ kind }) {
  const ref = useRef(null);
  useTick((t) => {
    const cv = ref.current;
    if (!cv || !cv.offsetParent) return;
    const c = cv.getContext('2d');
    c.clearRect(0, 0, 36, 40);
    STRUCTURES[kind](c, t);
  });
  return <canvas ref={ref} className="bm-px" width="36" height="40" aria-hidden="true" />;
}

/* ---------- the Martian landscape: 200 x 100 pixels ---------- */
const SKY = [[0, '#1a0b2e'], [10, '#24103e'], [18, '#33164c'], [26, '#4a1c50'], [33, '#6a2448'], [39, '#a03a3a'], [44, '#d8603a'], [48, '#f0883e'], [51, '#ffb060']];
const GROUND = [[0, '#b4562e'], [10, '#a24a2a'], [20, '#8a3a26'], [32, '#6e2c20'], [42, '#4a1a1e']];
const top = (x) => 52 + Math.round(Math.sin(x * 0.06) * 1.2 + Math.sin(x * 0.17) * 0.8);

function buildStatic() {
  const cv = document.createElement('canvas');
  cv.width = 200; cv.height = 100;
  const c = cv.getContext('2d');
  SKY.forEach(([y, col], i) => R(c, 0, y, 200, (SKY[i + 1] ? SKY[i + 1][0] : 56) - y + 1, col));
  for (let i = 1; i < SKY.length; i++) for (let x = 0; x < 200; x++) {
    if (x % 2) P(c, x, SKY[i][0], SKY[i - 1][1]); else P(c, x, SKY[i][0] - 1, SKY[i][1]);
  }
  // sun, low on the right
  for (let y = -9; y <= 9; y++) for (let x = -9; x <= 9; x++) {
    const d = x * x + y * y;
    if (d <= 25) P(c, 172 + x, 46 + y, '#ffe2a8'); else if (d <= 81 && (x + y) % 2 === 0) P(c, 172 + x, 46 + y, '#ffb060');
  }
  R(c, 24, 12, 2, 2, '#7fb8ff'); // Earth
  // two ridges
  for (let x = 0; x < 200; x++) {
    const far = 56 - Math.round(7 + 5 * Math.sin(x * 0.07) + 3 * Math.sin(x * 0.19 + 1));
    R(c, x, far, 1, 60 - far, '#6a2a48'); P(c, x, far, '#8a4a66');
    const near = 56 - Math.round(3 + 3 * Math.sin(x * 0.05 + 2) + 2 * Math.sin(x * 0.13));
    R(c, x, near, 1, 60 - near, '#8a3640'); P(c, x, near, '#a84a58');
  }
  // ground, in hard bands
  for (let x = 0; x < 200; x++) {
    const y0 = top(x);
    GROUND.forEach(([o, col]) => { const s = Math.max(y0, 52 + o); R(c, x, s, 1, 100 - s, col); });
    P(c, x, y0, '#e08a5a');
  }
  // dune crests and shadows
  [[10, 66, 34], [70, 60, 40], [130, 64, 50]].forEach(([x0, y0, len]) => {
    for (let i = 0; i < len; i++) { P(c, x0 + i, y0 + Math.round(Math.sin(i * 0.12) * 2), '#c26a45'); P(c, x0 + i, y0 + 1 + Math.round(Math.sin(i * 0.12) * 2), '#7a3020'); }
  });
  // rocks
  [[3, 62], [100, 57], [196, 60], [57, 64]].forEach(([x, y]) => { R(c, x, y, 3, 2, '#5a2024'); P(c, x + 1, y - 1, '#5a2024'); P(c, x + 2, y, '#8a4034'); });
  return cv;
}

function live(c, t) {
  for (let i = 0; i < 36; i++) {
    const x = 3 + ((i * 53 + 11) % 194), y = 2 + ((i * 31 + 5) % 32);
    P(c, x, y, Math.sin(t * (0.8 + (i % 5) * 0.4) + i) > -0.5 ? (i % 7 === 0 ? '#ffd9a0' : '#fff') : '#4a4a6a');
  }
  const px = Math.round((t * 1.4) % 215) - 8;
  R(c, px, 14 + Math.round(Math.sin(t * 0.2) * 2), 2, 2, '#c9b9c9'); // Phobos
  c.globalAlpha = 0.55;
  for (let i = 0; i < 16; i++) {
    const x = Math.round((i * 37 + t * (5 + (i % 3) * 3)) % 204) - 2, y = 58 + ((i * 11) % 36) + Math.round(Math.sin(t + i));
    R(c, x, y, 2, 1, '#e8a878');
  }
  c.globalAlpha = 1;
}

function Landscape() {
  const ref = useRef(null);
  const cache = useRef(null);
  useTick((t) => {
    const cv = ref.current;
    if (!cv || !cv.offsetParent) return;
    if (!cache.current) cache.current = buildStatic();
    const c = cv.getContext('2d');
    c.drawImage(cache.current, 0, 0);
    live(c, t);
  });
  return <canvas ref={ref} className="bm-bg" width="200" height="100" aria-hidden="true" />;
}

const css = `
.bm-frame {
  --bm-n8: polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px));
  --bm-n4: polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px));
  position: relative; padding: 4px; background: #e2793a; clip-path: var(--bm-n8);
}
.bm-inner { background: #1a0b2e; clip-path: var(--bm-n4); }
.bm-px, .bm-bg { image-rendering: pixelated; }
.bm-px { display: block; width: 100%; height: auto; }

/* ---------- surface (wide screens) ---------- */
.bm-scene { position: relative; aspect-ratio: 2 / 1; container-type: inline-size; overflow: hidden; }
.bm-bg { position: absolute; inset: 0; width: 100%; height: 100%; }

.bm-spot {
  position: absolute; top: 0; bottom: 0; width: 20%;
  padding: 0; border: 0; background: none; cursor: pointer;
  color: inherit; font: inherit; text-align: center; -webkit-tap-highlight-color: transparent; user-select: none;
}
.bm-spot::after {
  content: ''; position: absolute; left: 50%; translate: -50% 0;
  bottom: calc(var(--b) - 3%); width: 80%; height: 4px;
  background: repeating-linear-gradient(90deg, #ffd45a 0 8px, transparent 8px 14px); opacity: 0;
}
.bm-spot:hover::after, .bm-spot:focus-visible::after { opacity: 1; }

.bm-art { position: absolute; left: 50%; bottom: var(--b); width: 90%; translate: -50% 0; animation: bm-boot 0.6s steps(1) both; animation-delay: calc(var(--i) * 120ms + 0.2s); }
.bm-spot:hover .bm-art, .bm-spot:focus-visible .bm-art { translate: -50% -5px; }
.bm-spot:active .bm-art { translate: -50% 0; }

.bm-beacon, .bm-done {
  position: absolute; top: calc(var(--bt) - 8px); display: grid; place-items: center; min-width: 18px; height: 18px; padding: 0 3px;
  font: 700 12px/1 var(--mb-display, sans-serif); font-style: normal; color: #2a0c1c;
  box-shadow: 2px 0 #05090c, -2px 0 #05090c, 0 2px #05090c, 0 -2px #05090c;
}
.bm-beacon { right: 4%; background: #ffc93c; animation: bm-blink 1s steps(1) infinite; }
.bm-done { left: 4%; background: #4dff8a; }

.bm-cap {
  position: absolute; left: 0; right: 0; bottom: 3%; padding: 0 6px;
  display: flex; flex-direction: column; gap: 4px;
  animation: bm-boot 0.6s steps(1) both; animation-delay: calc(var(--i) * 120ms + 0.4s);
}
.bm-title { font: 700 clamp(14px, 1.6cqw, 18px)/1.3 var(--mb-display, sans-serif); text-transform: uppercase; color: #fff3dc; text-shadow: 2px 2px 0 #05090c; }
.bm-spot:hover .bm-title, .bm-spot:focus-visible .bm-title { color: #ffd45a; }
.bm-spot:focus-visible .bm-title { text-decoration: underline dashed; text-underline-offset: 4px; }
.bm-short { font: 400 clamp(14px, 1.8cqw, 20px)/1.2 var(--mb-body, sans-serif); color: #ffe3b8; text-shadow: 1px 1px 0 #05090c; }
.bm-warn { font: 400 clamp(13px, 1.6cqw, 18px)/1.2 var(--mb-body, sans-serif); color: #ffc93c; text-shadow: 1px 1px 0 #05090c; }
.bm-warn::before, .bm-row__warn::before {
  content: '!'; display: inline-grid; place-items: center; width: 1em; height: 1em; margin-right: 0.4em;
  background: #ffc93c; color: #2a0c1c; font: 700 0.6em/1 var(--mb-display, sans-serif); vertical-align: 0.15em; text-shadow: none;
}
.bm-ok { color: #4dff8a; }

/* ---------- manifest (phones) ---------- */
.bm-list { display: none; list-style: none; margin: 0; padding: 30px 6px 6px; background: #3a1434; }
.bm-list li + li { border-top: 2px dashed rgba(255, 154, 106, 0.35); }
.bm-row {
  display: grid; grid-template-columns: 72px 1fr 12px; align-items: center; gap: 14px;
  width: 100%; padding: 12px 8px; border: 0; background: none;
  color: inherit; font: inherit; text-align: left; cursor: pointer;
}
.bm-row:focus-visible { outline: 3px dashed #fff; outline-offset: -3px; }
.bm-row .bm-px { width: 72px; }
.bm-row__title { display: block; margin-bottom: 4px; font: 700 14px/1.3 var(--mb-display, sans-serif); text-transform: uppercase; color: #fff3dc; }
.bm-row__short { display: block; font: 400 18px/1.3 var(--mb-body, sans-serif); color: #ffe3b8; }
.bm-row__warn { display: block; margin-top: 3px; font: 400 18px/1.3 var(--mb-body, sans-serif); color: #ffc93c; }
.bm-row__go { width: 10px; height: 14px; background: #ffc93c; clip-path: polygon(0 0, 100% 50%, 0 100%); }

/* stations are div[role=button], so global <button> styles can't touch them; these are a safety net */
.bm-frame .bm-spot, .bm-frame .bm-spot:hover, .bm-frame .bm-spot:active, .bm-frame .bm-spot:focus, .bm-frame .bm-spot:focus-visible {
  background: none; border: 0; border-radius: 0; box-shadow: none; filter: none; transform: none; outline: none; margin: 0; min-height: 0;
}
.bm-frame .bm-row, .bm-frame .bm-row:active { background: none; border: 0; border-radius: 0; box-shadow: none; filter: none; transform: none; }
.bm-frame .bm-row:hover { background: rgba(255, 255, 255, 0.05); box-shadow: none; filter: none; transform: none; }

@media (max-width: 779px) {
  .bm-scene { display: none; }
  .bm-list { display: block; }
}
@keyframes bm-boot { 0% { opacity: 0; } 25% { opacity: 1; } 40% { opacity: 0; } 60% { opacity: 1; } 70% { opacity: 0.3; } 100% { opacity: 1; } }
@keyframes bm-blink { 50% { opacity: 0.2; } }
@media (prefers-reduced-motion: reduce) { .bm-frame *, .bm-frame *::after { animation: none !important; } }
`;

export default function BaseMap({ items, onSelect }) {
  return (
    <div className="bm-frame">
      <style>{css}</style>
      <div className="bm-inner">
        <div className="bm-scene">
          <Landscape />
          {items.map((it, i) => {
            const kind = kindOf(it.title, i);
            const s = SPOT[kind];
            const done = Boolean(it.doneOption);
            return (
              <div
                key={it.id}
                role="button"
                tabIndex={0}
                className="bm-spot"
                style={{ left: `${s.col * 20}%`, '--b': `${s.b}%`, '--bt': `${s.bt}%`, '--i': i }}
                onClick={() => onSelect(it.id)}
                onKeyDown={press(() => onSelect(it.id))}
              >
                <span className="bm-art">
                  <Pixel kind={kind} />
                  {it.warning && <i className="bm-beacon" aria-hidden="true">!</i>}
                  {done && <i className="bm-done" aria-hidden="true">OK</i>}
                </span>
                <span className="bm-cap">
                  <b className="bm-title">{done && <span className="bm-ok">OK </span>}{it.title}</b>
                  <span className="bm-short">{it.short}</span>
                  {it.warning && <span className="bm-warn">{it.warning}</span>}
                </span>
              </div>
            );
          })}
        </div>

        <ul className="bm-list">
          {items.map((it, i) => {
            const done = Boolean(it.doneOption);
            return (
              <li key={it.id}>
                <div role="button" tabIndex={0} className="bm-row" onClick={() => onSelect(it.id)} onKeyDown={press(() => onSelect(it.id))}>
                  <Pixel kind={kindOf(it.title, i)} />
                  <span>
                    <b className="bm-row__title">{done && <span className="bm-ok">OK </span>}{it.title}</b>
                    <span className="bm-row__short">{it.short}</span>
                    {it.warning && <span className="bm-row__warn">{it.warning}</span>}
                  </span>
                  <span className="bm-row__go" aria-hidden="true" />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}