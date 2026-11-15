// Pixel-art world renderer for the Dashboard (space-station cutaway) and the Challenge
// scenes. Pure drawing: no React, no game rules. A scene description goes in, pixels come out.
//
// Everything is drawn on a small logical canvas (about 240 x 132 pixels) that the page scales
// by a whole number with image-rendering: pixelated. Palette is the blood-moon set plus a few
// functional accents. Port of the approved reference (screenshots/ + mars-pixel-world.html).

export const RW = 64; // room size on the dashboard (logical pixels)
export const RH = 44;
const GAP = 30; // room between station rooms: it holds the name label under each room
const LABEL = 14; // extra hull height under the last row, for its labels
const PAD = 10;
const WING = 26;
const T0 = 24;
const GROUND_Y = 88;

export const C = {
  navy: '#0d0603', deep: '#3c2414', dusk: '#5b1d0a', rust: '#6b3524', orange: '#cd6031',
  sand: '#fbab79', bone: '#fff0e0', grey: '#9c7a68', lgrey: '#d9b29c', dgrey: '#5a3a2a',
  green: '#7bbf4a', red: '#e8404f', cyan: '#4fd1e8', yellow: '#ffd23f', blue: '#3b7be0',
  dblue: '#243a8a', dred: '#6b1f2a', lcyan: '#bff4ff', peach: '#f49874', brown: '#7c4c34',
};

// Sky per Sol: 0 = Sol 1, 1 = Sol 2, 2 = Sol 3, 3 = night.
const P = [
  { sky: ['#3c2414', '#5b1d0a', '#8a3a1c', '#cd6031', '#f49874'], stars: 8, sun: 'day' },
  { sky: ['#000000', '#3c2414', '#5b1d0a', '#7c4c34', '#cd6031'], stars: 22, sun: 'set' },
  { sky: ['#000000', '#0a0604', '#1e100a', '#3c2414', '#5b1d0a'], stars: 38, sun: 'moon' },
  { sky: ['#000000', '#030201', '#0a0604', '#140a06', '#2a150d'], stars: 52, sun: 'moon2' },
];
const SPACE = [
  ['#000000', '#05030a', '#0e0806', '#1e100a', '#3c2414'],
  ['#000000', '#05030a', '#140a08', '#2a150d', '#5b1d0a'],
  ['#000000', '#030208', '#0a0604', '#140a06', '#2a150d'],
  ['#000000', '#000000', '#050302', '#0a0604', '#140a06'],
];
const LIMB = [
  { rim: '#fbab79', body: ['#f49874', '#cd6031', '#8a3a1c', '#5b1d0a'] },
  { rim: '#cd6031', body: ['#cd6031', '#8a3a1c', '#5b1d0a', '#3c2414'] },
  { rim: '#7c4c34', body: ['#6b3524', '#5b1d0a', '#3c2414', '#1e100a'] },
  { rim: '#3c2414', body: ['#2a150d', '#1e100a', '#140a06', '#0a0604'] },
];
const PLANET = [
  ['#fff0e0', '#fbab79', '#f49874', '#cd6031'],
  ['#f49874', '#cd6031', '#7c4c34', '#5b1d0a'],
  ['#7c4c34', '#6b3524', '#5b1d0a', '#3c2414'],
  ['#3c2414', '#2a150d', '#1e100a', '#0a0604'],
];
const TER = [
  { lit: ['#fbab79', '#f49874', '#cd6031'], shade: ['#6b3524', '#5b1d0a'], gr: ['#cd6031', '#f49874', '#8a3a1c', '#5b1d0a'], rock: ['#9c4a2a', '#6b3524', '#4a2014'] },
  { lit: ['#f49874', '#cd6031', '#7c4c34'], shade: ['#5b1d0a', '#3c2414'], gr: ['#8a3a1c', '#cd6031', '#5b1d0a', '#3c2414'], rock: ['#6b3524', '#4a2014', '#2a150d'] },
  { lit: ['#7c4c34', '#6b3524', '#5b1d0a'], shade: ['#3c2414', '#1e100a'], gr: ['#4a2418', '#6b3524', '#3a1c12', '#1e100a'], rock: ['#4a2418', '#3a1c12', '#1e100a'] },
  { lit: ['#3c2414', '#2a150d', '#1e100a'], shade: ['#140a06', '#0a0604'], gr: ['#2a150d', '#3c2414', '#1e100a', '#0a0604'], rock: ['#2a150d', '#1e100a', '#0a0604'] },
];
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

// ---------- small helpers ----------
const hexRGB = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixHex = (a, b, t) => {
  const A = hexRGB(a);
  const B = hexRGB(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const hsh = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const per = (x, p) => ((x % p) + p) % p;
const cdist = (x, cx, p) => {
  const d = per(x - cx, p);
  return Math.min(d, p - d);
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (() => {
  let s = 7;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
})();
const STARS = Array.from({ length: 170 }, () => ({ x: Math.floor(rnd() * 900) - 330, y: Math.floor(rnd() * 560) - 490, p: Math.floor(rnd() * 4), big: rnd() < 0.15 }));
const PX = Array.from({ length: 70 }, () => rnd());
const PY = Array.from({ length: 70 }, () => rnd());

// terrain silhouettes (three layers of Mars mountains)
const MID = [
  { t: 'mesa', cx: 80, top: 56, sl: 1.15, w: 18 },
  { t: 'spire', cx: 150, top: 30, sl: 2.9 },
  { t: 'spire', cx: 218, top: 46, sl: 2.4 },
  { t: 'tri', cx: 285, top: 54, sl: 0.85 },
];
function topFar(x) {
  let y = 74 - 4 * Math.sin(x * 0.035) - 3 * Math.sin(x * 0.09 + 2);
  [[40, 62, 0.9], [165, 58, 0.8]].forEach(([cx, top, sl]) => {
    y = Math.min(y, top + cdist(x, cx, 240) * sl);
  });
  return Math.round(y + Math.floor(hsh(x >> 1) * 2));
}
function topMid(x) {
  let y = 82 - 3 * Math.sin(x * 0.04 + 1);
  MID.forEach((m) => {
    const dx = cdist(x, m.cx, 320);
    let t;
    if (m.t === 'mesa') t = m.top + Math.max(0, dx - m.w) * m.sl;
    else if (m.t === 'spire') t = m.top + dx * m.sl + Math.floor(hsh(x) * 2);
    else t = m.top + dx * m.sl;
    y = Math.min(y, t);
  });
  return Math.round(y);
}
function topNear(x) {
  let y = 86 - 4 * Math.sin(x * 0.025 + 0.5) - 2 * Math.sin(x * 0.07);
  [[18, 38, 0.5], [205, 50, 0.62]].forEach(([cx, top, sl]) => {
    const dx = cdist(x, cx, 300);
    y = Math.min(y, top + dx * sl - 3 * Math.sin(x * 0.11 + cx) + Math.floor(hsh(x >> 1) * 2));
  });
  return Math.round(y);
}

// ---------- the world ----------
export function createWorld(canvas) {
  const g = canvas.getContext('2d');
  let Wl = 240;
  let Hl = 132;
  let SCALE = 4;
  let OX = 0;
  let OY = 0;
  let VX0 = 0;
  let VX1 = 240;
  let VY0 = 0;
  let VY1 = 132;
  let portrait = false;
  let bx = 0;
  let by = 0;
  let bw = 0;
  let bh = 0;
  let rooms = {};
  let dashStars = [];
  let hidePlanet = false;
  let S = null; // scene being drawn

  const R = (x, y, w, h, c, ctx = g) => {
    ctx.fillStyle = c;
    ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
  };
  const F = () => (S.reduced ? 0 : S.tick);
  const circle = (cx, cy, r, c) => {
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.6) R(cx + x, cy + y, 1, 1, c);
  };
  const octRect = (x, y, w, h, c, cut) => {
    for (let j = 0; j < h; j++) {
      const ins = j < cut ? cut - j : j >= h - cut ? j - (h - cut - 1) : 0;
      R(x + ins, y + j, w - 2 * ins, 1, c);
    }
  };
  const lightCol = (v) => (v >= 40 ? C.green : v >= 20 ? C.yellow : C.red);

  function pxDither(x, y, w, h, key, i) {
    const cur = P[S.phase];
    const old = P[S.prev];
    const get = (p) => (i === undefined ? p[key] : p[key][i]);
    if (S.trans >= 1) {
      R(x, y, w, h, get(cur));
      return;
    }
    const t = S.trans * 16;
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) R(xx, yy, 1, 1, BAYER[yy & 3][xx & 3] < t ? get(cur) : get(old));
  }

  // ----- sun-lit globes (planet and moons) -----
  function ball(cx, cy, r, ramp, swirl) {
    const f = F();
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r + r * 0.5) continue;
        const u = (-dx * 0.7 - dy * 0.55) / (r * 1.25);
        let l = u > 0.35 ? 0 : u > -0.12 ? 1 : u > -0.55 ? 2 : 3;
        if (((u > 0.3 && u < 0.4) || (u > -0.17 && u < -0.07) || (u > -0.6 && u < -0.5)) && ((dx + dy) & 1)) l = Math.max(0, l - 1);
        if (swirl && l <= 1 && Math.sin((dy + dx * 0.18) * 0.85 + f * 0.03) > 0.62) l = 0;
        R(cx + dx, cy + dy, 1, 1, ramp[l]);
      }
    }
  }
  function drawPlanet() {
    if (hidePlanet) return;
    const ramp = PLANET[S.phase];
    const f = F();
    ball(150, 40, 25, ramp, true);
    ball(92 + Math.floor(Math.sin(f * 0.01) * 3), 30, 5, ramp, false);
    ball(226, 44, 9, ramp, false);
  }

  // ----- sky for the story scenes -----
  function drawSky() {
    const top = Math.min(0, VY0);
    const bandH = (GROUND_Y - top) / 5;
    for (let b = 0; b < 5; b++) pxDither(VX0, Math.round(top + b * bandH), VX1 - VX0, Math.ceil(bandH) + 1, 'sky', b);
    if (S.trans >= 1) {
      for (let b = 1; b < 5; b++) {
        const y0 = Math.round(top + b * bandH);
        for (let x = VX0; x < VX1; x++) {
          if (((x + y0) & 1) === 0) R(x, y0, 1, 1, P[S.phase].sky[b]);
          if (((x + y0) & 1) === 1) R(x, y0 - 1, 1, 1, P[S.phase].sky[b]);
          if (((x >> 1) + y0) % 2 === 0) R(x, y0 + 1, 1, 1, P[S.phase].sky[b - 1]);
        }
      }
    }
    const f = F();
    const n = P[S.phase].stars;
    STARS.slice(0, n * 3).forEach((s) => {
      if ((f + s.p) % 4 >= 3) return;
      R(s.x, s.y, 1, 1, C.bone);
      if (s.big && (f + s.p) % 4 === 0) {
        R(s.x - 1, s.y, 3, 1, C.bone);
        R(s.x, s.y - 1, 1, 3, C.bone);
      }
    });
    if (P[S.phase].sun === 'set') {
      circle(196, 62, 9, C.orange);
      circle(196, 62, 6, C.yellow);
    }
    drawPlanet();
  }

  // ----- Mars terrain (cached per Sol) -----
  function paintTerrain(ph) {
    const w = VX1 - VX0;
    const h = VY1 - T0;
    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const c = cv.getContext('2d');
    const T = TER[ph];
    const haze = P[ph].sky[4];
    const px = (x, y, ww, hh, col) => {
      c.fillStyle = col;
      c.fillRect(x - VX0, y - T0, ww, hh);
    };
    function layer(top, lit, shade, bottom) {
      for (let x = VX0; x < VX1; x++) {
        const t = top(x);
        const sl = top(x + 2) - top(x - 2);
        for (let y = t; y < bottom; y++) {
          const d = y - t;
          let col;
          if (sl <= 0) {
            let l = d < 4 ? 0 : d < 13 ? 1 : 2;
            if ((d === 4 || d === 5) && ((x + y) & 1)) l = 0;
            if ((d === 13 || d === 14) && ((x + y) & 1)) l = 1;
            if (d >= 4 && (((d + (x >> 1)) >> 2) & 3) === 0 && l < 2) l++;
            col = lit[l];
          } else {
            let l = d < 9 ? 0 : 1;
            if ((d === 9 || d === 10) && ((x + y) & 1)) l = 0;
            if (d >= 3 && (((d + (x >> 1)) >> 2) & 3) === 1 && l === 1) l = 0;
            col = shade[l];
          }
          if (d === 0) col = sl <= 0 ? lit[0] : shade[0];
          px(x, y, 1, 1, col);
        }
      }
    }
    layer(topFar, T.lit.map((cc) => mixHex(cc, haze, 0.72)), T.shade.map((cc) => mixHex(cc, haze, 0.6)), 90);
    layer(topMid, T.lit.map((cc) => mixHex(cc, haze, 0.38)), T.shade.map((cc) => mixHex(cc, haze, 0.28)), 90);
    layer(topNear, T.lit, T.shade, 90);
    const gr = T.gr;
    px(VX0, GROUND_Y, w, VY1 - GROUND_Y, gr[0]);
    for (let y = GROUND_Y; y < GROUND_Y + 4; y++) {
      for (let x = VX0; x < VX1; x++) if (((x + y) & 1) === 0 || y === GROUND_Y) px(x, y, 1, 1, mixHex(gr[0], haze, y === GROUND_Y ? 0.55 : 0.3));
    }
    for (let k = 0; k < 18; k += 2) {
      const ry = 91 + Math.round(k * k * 0.5 + k * 2.4);
      if (ry >= VY1 - 1) break;
      for (let x = VX0; x < VX1; x++) {
        const yy = ry + Math.round(Math.sin(x * 0.045 + k * 1.7) * (1 + k * 0.1));
        if (((x >> 2) + k * 3) % 5 !== 0) px(x, yy, 1, 1, gr[1]);
        if (((x >> 1) + k) % 3 !== 0) px(x, yy + 1, 1, 1, gr[2]);
      }
    }
    const rocks = [];
    for (let i = 0; i < 16; i++) {
      const x = Math.floor(VX0 + hsh(i * 7.3) * w);
      const y = Math.floor(106 + hsh(i * 3.1) * Math.max(4, VY1 - 112));
      if (y > VY1 - 3) continue;
      rocks.push([x, y]);
    }
    rocks.sort((a, b) => a[1] - b[1]).forEach(([x, y], i) => {
      const rw = Math.min(8, Math.max(2, Math.round(2 + (y - 90) * 0.22 + hsh(i) * 3)));
      const rh = Math.max(2, Math.round(rw * 0.55));
      for (let r = 0; r < 2; r++) for (let k = 0; k < Math.round(rw * 1.5); k++) if (((k + r) & 1) === 0 || r === 0) px(x + Math.round(rw * 0.3) + k, y + rh - 1 + r, 1, 1, gr[3]);
      for (let r = 0; r < rh; r++) {
        const yy = (r - rh / 2 + 0.5) / (rh / 2);
        const hw = Math.max(1, Math.round((rw / 2) * Math.sqrt(Math.max(0, 1 - yy * yy))));
        for (let k = -hw; k <= hw; k++) {
          const lit = r < rh * 0.34 || (k < -hw * 0.3 && r < rh * 0.6);
          const dark = r >= rh * 0.7 || k > hw * 0.5;
          px(x + k, y + r, 1, 1, lit ? T.rock[0] : dark ? T.rock[2] : T.rock[1]);
        }
      }
    });
    return cv;
  }
  const TCACHE = {};
  let tKey = '';
  let TB = null;
  function getTerrain(ph) {
    const k = `${VX0},${VX1},${VY1}`;
    if (k !== tKey) {
      Object.keys(TCACHE).forEach((p) => delete TCACHE[p]);
      tKey = k;
    }
    if (!TCACHE[ph]) TCACHE[ph] = paintTerrain(ph);
    return TCACHE[ph];
  }
  function drawTerrain() {
    const cur = getTerrain(S.phase);
    if (S.trans >= 1 || S.prev === S.phase) {
      g.drawImage(cur, VX0, T0);
      return;
    }
    const old = getTerrain(S.prev);
    const w = cur.width;
    const h = cur.height;
    if (!TB || TB.width !== w || TB.height !== h) {
      TB = document.createElement('canvas');
      TB.width = w;
      TB.height = h;
    }
    const a = old.getContext('2d').getImageData(0, 0, w, h);
    const b = cur.getContext('2d').getImageData(0, 0, w, h);
    const o = TB.getContext('2d').createImageData(w, h);
    const t = S.trans * 16;
    for (let i = 0; i < w * h; i++) {
      const x = i % w;
      const y = ((i / w) | 0) + T0;
      const src = BAYER[y & 3][(x + VX0) & 3] < t ? b : a;
      const j = i * 4;
      o.data[j] = src.data[j];
      o.data[j + 1] = src.data[j + 1];
      o.data[j + 2] = src.data[j + 2];
      o.data[j + 3] = src.data[j + 3];
    }
    TB.getContext('2d').putImageData(o, 0, 0);
    g.drawImage(TB, VX0, T0);
  }

  // ----- astronaut -----
  const ZZ = ['zzz', '..z', 'zzz'];
  function drawAstro(cx, yb, mood, dir, f) {
    const m = (x) => (dir >= 0 ? cx + x : cx - x);
    const rect = (x, y, w, h, c) => {
      const a = m(x);
      const b = m(x + w);
      R(Math.min(a, b), y, Math.abs(b - a), h, c);
    };
    let y = yb - 20;
    if (mood === 'cheer') y -= (f % 2) * 3;
    if (mood === 'idle' && f % 6 > 3) y += 1;
    const parts = (pad, col) => {
      const c = (k) => col || k;
      rect(-4 - pad, y - pad, 8 + 2 * pad, 7 + 2 * pad, c(C.bone));
      rect(-4 - pad, y + 7 - pad, 8 + 2 * pad, 7 + 2 * pad, c(C.bone));
      rect(-7 - pad, y + 7 - pad, 3 + pad, 7 + 2 * pad, c(C.grey));
      const walk = mood === 'idle' ? f % 2 : 0;
      rect(-3 - pad, y + 14 - pad, 3 + pad, 4 + walk + 2 * pad, c(C.bone));
      rect(1 - pad, y + 14 - pad, 3 + pad, 4 + (1 - walk) + 2 * pad, c(C.bone));
      if (mood === 'cheer') {
        rect(-6 - pad, y + 1 - pad, 2 + pad, 7 + 2 * pad, c(C.bone));
        rect(4 - pad, y + 1 - pad, 2 + pad, 7 + 2 * pad, c(C.bone));
      } else rect(4 - pad, y + 8 - pad, 2 + pad, 5 + 2 * pad, c(C.bone));
    };
    parts(1, C.navy);
    parts(0);
    rect(-3, y + 2, 6, 4, mood === 'sleep' ? C.navy : '#2a6fa8');
    if (mood !== 'sleep') rect(1, y + 2, 2, 1, C.lcyan);
    else rect(-2, y + 4, 4, 1, C.grey);
    rect(-2, y + 9, 4, 2, C.orange);
    rect(-3, y + 17, 3, 2, C.grey);
    rect(1, y + 17, 3, 2, C.grey);
    if (mood === 'worried') R(m(5), y + 1 + (f % 3), 1, 2, C.cyan);
    if (mood === 'sleep') {
      const zy = y - 4 - (f % 4);
      ZZ.forEach((row, j) => [...row].forEach((ch, i) => ch === 'z' && R(cx + 6 + i, zy + j, 1, 1, C.bone)));
    }
  }
  function fan(cx, cy, r, frame) {
    circle(cx, cy, r, C.navy);
    circle(cx, cy, r - 2, '#0d0603');
    if (frame % 2 === 0) {
      R(cx - r + 3, cy - 1, 2 * r - 6, 2, C.lgrey);
      R(cx - 1, cy - r + 3, 2, 2 * r - 6, C.lgrey);
    } else {
      for (let i = -r + 4; i <= r - 4; i++) {
        R(cx + i, cy + i, 2, 2, C.lgrey);
        R(cx + i, cy - i, 2, 2, C.lgrey);
      }
    }
    circle(cx, cy, 2, C.grey);
  }

  // ===================== DASHBOARD: station cutaway =====================
  function drawSpace() {
    const ph = S.phase;
    const f = F();
    const bands = SPACE[ph];
    const n = 5;
    for (let b = 0; b < n; b++) R(0, Math.floor((b * Hl) / n), Wl, Math.ceil(Hl / n) + 1, bands[b]);
    for (let b = 1; b < n; b++) {
      const y0 = Math.floor((b * Hl) / n);
      for (let x = 0; x < Wl; x++) {
        if (((x + y0) & 1) === 0) R(x, y0, 1, 1, bands[b]);
        else R(x, y0 - 1, 1, 1, bands[b]);
      }
    }
    const vis = [0.25, 0.5, 0.85, 1][ph];
    dashStars.forEach((s, i) => {
      if (i / dashStars.length > vis) return;
      if ((f + s.p) % 5 === 0) return;
      R(s.x, s.y, 1, 1, i % 4 ? C.bone : C.lgrey);
      if (s.b && (f + s.p) % 5 === 1) {
        R(s.x - 1, s.y, 3, 1, C.bone);
        R(s.x, s.y - 1, 1, 3, C.bone);
      }
    });
    ball(Math.round(Wl * 0.88), Math.round(Hl * 0.2), 4, PLANET[ph], false);
    // the Mars limb
    const L = LIMB[ph];
    const R0 = Wl * 1.1;
    const cap = Math.max(22, Math.round(Hl * 0.13));
    const cx = Wl / 2;
    const cy = Hl - cap + R0;
    for (let x = 0; x < Wl; x++) {
      const dx = x - cx;
      const y0 = Math.round(cy - Math.sqrt(R0 * R0 - dx * dx));
      for (let k = 1; k <= 4; k++) if (((x + k) & 1) === 0 || k === 1) R(x, y0 - k, 1, 1, k === 1 ? L.rim : mixHex(L.rim, bands[4], 0.35 * k));
      for (let y = y0; y < Hl; y++) {
        const d = y - y0;
        let i = d < 5 ? 0 : d < 14 ? 1 : d < 24 ? 2 : 3;
        if ((d === 5 || d === 6 || d === 14 || d === 15 || d === 24 || d === 25) && ((x + y) & 1)) i = Math.max(0, i - 1);
        const nz = Math.sin(x * 0.06 + d * 0.31) + Math.sin(x * 0.023 - d * 0.17);
        if (nz > 1.45 && i < 3) i++;
        R(x, y, 1, 1, L.body[i]);
      }
    }
  }

  const ROOMS = {
    life(l, x, y, f) {
      const o = S.shown.o;
      const w = S.shown.w;
      l(10, 9, 14, 28, C.navy);
      l(11, 10, 12, 26, C.grey);
      l(13, 13, 8, 20, C.navy);
      const lo = Math.round((20 * o) / 100);
      if (lo > 0) {
        l(13, 33 - lo, 8, lo, C.cyan);
        l(13, 33 - lo, 8, 1, C.lcyan);
      }
      if (lo > 4) l(15 + ((f >> 1) & 1), 32 - ((f * 2) % Math.max(lo - 1, 2)), 1, 1, C.bone);
      l(15, 5, 4, 4, C.navy);
      l(16, 6, 2, 2, lightCol(o));
      l(32, 16, 18, 22, C.navy);
      l(33, 17, 16, 20, C.dblue);
      l(35, 20, 12, 14, C.navy);
      const lw = Math.round((14 * w) / 100);
      if (lw > 0) {
        l(35, 34 - lw, 12, lw, C.blue);
        l(35, 34 - lw, 12, 1, C.cyan);
      }
      l(39, 12, 4, 4, C.navy);
      l(40, 13, 2, 2, lightCol(w));
      l(24, 34, 8, 2, C.dgrey);
      fan(x + 56, y + 17, 5, o >= 20 ? f : f % 8 === 0 ? 1 : 0);
    },
    rad(l, x, y, f) {
      const c = S.shown.c;
      const col = c <= 19 ? (f % 2 ? C.red : C.dred) : c < 40 ? C.yellow : C.cyan;
      l(26, 30, 12, 8, C.navy);
      l(27, 31, 10, 6, C.grey);
      l(30, 27, 4, 4, C.dgrey);
      l(31, 24, 2, 3, C.lcyan);
      const ring = f % 4;
      [8, 13, 18].forEach((r, i) => {
        if (ring >= i || ring === 3) {
          for (let a = Math.PI * 1.08; a < Math.PI * 1.92; a += 0.09) {
            const px = x + 32 + Math.cos(a) * r * 1.3;
            const py = y + 36 + Math.sin(a) * r * 1.5;
            if (py > y + 3) R(px, py, 1, 1, col);
          }
        }
      });
      l(6, 28, 8, 10, C.navy);
      l(7, 29, 6, 8, '#2a150d');
      l(8, 31 + (f % 2), 4, 2, C.orange);
      l(50, 28, 8, 10, C.navy);
      l(51, 29, 6, 8, '#2a150d');
      l(52, 31 + ((f + 1) % 2), 4, 2, C.orange);
    },
    power(l, x, y, f) {
      const p = S.shown.p;
      const seg = Math.ceil(p / 20);
      const col = lightCol(p);
      l(9, 8, 20, 30, C.navy);
      l(10, 9, 18, 28, C.dgrey);
      l(13, 6, 12, 3, C.grey);
      for (let i = 0; i < 5; i++) l(12, 33 - i * 5, 14, 3, i < seg ? col : C.navy);
      ICON_P.forEach((row, j) =>
        [...row].forEach((ch, i) => {
          if (ch !== '.') R(x + 31 + i * 2, y + 12 + j * 2, 2, 2, f % 3 === 0 ? C.bone : C.yellow);
        }),
      );
      l(46, 9, 14, 12, C.navy);
      l(47, 10, 12, 10, p < 40 ? C.deep : C.dblue);
      l(47, 14, 12, 1, C.blue);
      l(52, 10, 1, 10, C.blue);
      if (p >= 40) {
        const sx = (f * 3) % 20;
        if (sx < 12) l(47 + sx, 10, 2, 10, C.lcyan);
      }
      l(52, 21, 2, 15, C.grey);
    },
    green(l, x, y, f) {
      const st = S.plant;
      const sway = [0, 0, 1, 0][f % 4];
      [10, 28, 46].forEach((px) => {
        l(px - 1, 5, 14, 3, C.dgrey);
        l(px + 2, 8, 8, 2, '#b04fd1');
        for (let r = 0; r < 18; r++) {
          const w = 1 + (r >> 2);
          for (let q = -w; q <= w; q++) if (((q + r + f) & 3) === 0) l(px + 6 + q, 10 + r, 1, 1, '#7a3a8a');
        }
        l(px, 32, 12, 6, C.navy);
        l(px + 1, 33, 10, 5, C.rust);
        l(px + 1, 33, 10, 1, C.orange);
        const h = [0, 5, 9, 13][st];
        if (st === 0) l(px + 4, 32, 4, 1, C.sand);
        else {
          l(px + 5, 32 - h, 2, h, C.green);
          l(px + 2 + sway, 32 - h + 1, 3, 2, C.green);
          l(px + 7 + sway, 32 - h, 3, 2, C.green);
          if (st >= 3) {
            l(px + 1, 27, 3, 3, C.red);
            l(px + 8, 24, 3, 3, C.red);
          }
        }
      });
      if (st >= 3 && f % 2) l(56, 9, 1, 3, C.yellow);
    },
    msg(l, x, y, f) {
      const s = S.shown.s;
      const lit = Math.min(4, Math.ceil(s / 4));
      const tilt = [0, 1, 2, 1][(f >> 1) % 4];
      l(5, 17, 22, 20, C.navy);
      l(6, 18, 20, 18, '#08122b');
      for (let r = 0; r < 4; r++) if (r < lit) l(8, 21 + r * 3, Math.min(6 + ((f * 3 + r * 5) % 13), 16), 1, C.green);
      if (s === 0 && f % 2 === 0) l(8, 22, 3, 2, C.green);
      l(40, 26, 4, 12, C.grey);
      l(36, 36, 12, 2, C.dgrey);
      for (let r = -7; r <= 7; r++) {
        const off = Math.round((r * r) / 8);
        l(41 + off + tilt - 4, 22 + r + tilt, 3, 1, C.lgrey);
      }
      l(46, 18, 1, 6, C.grey);
      l(45, 15, 3, 3, f % 2 ? C.yellow : C.deep);
      const ring = f % 4;
      if (ring >= 1) l(52, 14, 1, 4, C.cyan);
      if (ring >= 2) l(55, 11, 1, 10, C.cyan);
      if (ring >= 3) l(58, 8, 1, 16, C.cyan);
      circle(x + 56, y + 6, 3, C.blue);
      R(x + 55, y + 5, 2, 1, C.green);
    },
  };
  const ICON_P = ['....yyy.', '...yyy..', '..yyy...', '.yyyyyy.', '...yyy..', '..yyy...', '..yy....', '.y......'];

  function room(id) {
    const { x, y } = rooms[id];
    const f = F();
    const done = !!S.done[id];
    const hover = S.hover === id;
    const rim = done ? C.green : hover ? C.sand : '#9c7a68';
    octRect(x - 2, y - 2, RW + 4, RH + 4, rim, 7);
    octRect(x, y, RW, RH, '#1e100a', 6);
    const l = (a, b, w, h, c) => R(x + a, y + b, w, h, c);
    l(6, 0, RW - 12, 2, '#4a2c1c');
    l(0, RH - 8, RW, 8, '#3c2414');
    l(0, RH - 8, RW, 1, '#5a3a2a');
    ROOMS[id](l, x, y, f);
    for (let j = 0; j < 6; j++) {
      const ins = 6 - j;
      R(x, y + j, ins, 1, rim);
      R(x + RW - ins, y + j, ins, 1, rim);
      R(x, y + RH - 1 - j, ins, 1, rim);
      R(x + RW - ins, y + RH - 1 - j, ins, 1, rim);
    }
  }

  function drawDash() {
    drawSpace();
    const f = F();
    if (!portrait) {
      [-1, 1].forEach((sd) => {
        const px = sd < 0 ? bx - WING + 2 : bx + bw + 4;
        const cy = by + Math.floor(bh / 2);
        R(sd < 0 ? bx - 6 : bx + bw, cy - 2, 6, 4, '#7c4c34');
        [0, 1].forEach((k) => {
          const py = cy - 44 + k * 46;
          R(px - 1, py - 1, 22, 42, C.navy);
          for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 2; c++) {
              const xx = px + c * 10;
              const yy = py + r * 10;
              R(xx, yy, 9, 9, C.dblue);
              R(xx, yy, 9, 1, C.blue);
              R(xx, yy, 1, 9, C.blue);
            }
          }
          if (!S.reduced) {
            const sx = (f * 2 + k * 11) % 40;
            for (let r = 0; r < 40; r++) {
              const q = sx - r;
              if (q >= 0 && q < 20) R(px + q, py + r, 1, 1, C.lcyan);
            }
          }
        });
      });
    }
    octRect(bx - 3, by - 3, bw + 6, bh + 6, '#7c4c34', 10);
    octRect(bx, by, bw, bh, '#3c2414', 8);
    R(bx + 12, by + 1, bw - 24, 1, '#5a3a2a');
    for (let i = 0; i < 6; i++) R(bx + 5 + i, by + 5, 1, 1, '#9c7a68');
    const ax = bx + Math.floor(bw / 2);
    R(ax, by - 12, 1, 10, C.grey);
    R(ax - 2, by - 14, 5, 2, C.lgrey);
    R(ax - 1, by - 16, 3, 2, f % 6 < 3 ? C.yellow : C.deep);
    Object.keys(rooms).forEach((id) => {
      const r = rooms[id];
      R(r.x + RW / 2 - 1, r.y + RH + 2, 2, GAP - 3, '#5a3a2a');
    });
    Object.keys(rooms).forEach((id) => room(id));
  }

  // ===================== CHALLENGE SCENES =====================
  // All five scenes share the radiation scene's look: a Mars sky, three layers of mountains,
  // and a small base built on the red ground. Objects stand on y = 100 (back) to 120 (front).
  function outdoor(ph, noPlanet) {
    const a = S.phase;
    const b = S.prev;
    const t = S.trans;
    S.phase = ph;
    S.prev = ph;
    S.trans = 1;
    hidePlanet = !!noPlanet;
    drawSky();
    drawTerrain();
    S.phase = a;
    S.prev = b;
    S.trans = t;
    hidePlanet = false;
  }
  const good = (r) => r === 'good' || r === 'mid';

  // --- sprites (all drawn from the ground line `base` upwards) ---
  function steam(px, base, f, n, col) {
    for (let k = 0; k < n; k++) {
      const t = (f * 1.2 + k * (24 / n)) % 24;
      if (t >= 22) continue;
      const x = px + Math.round(Math.sin((t + k * 3) * 0.35) * 2);
      const sz = 2 + Math.floor(t / 8);
      R(x, base - t, sz, sz, t > 14 ? col[1] : col[0]);
      R(x + 1, base - t - 1, Math.max(1, sz - 1), 1, col[1]);
    }
  }
  function crate(x, base, w, h) {
    R(x - 1, base - h - 1, w + 2, h + 1, C.navy);
    R(x, base - h, w, h, C.brown);
    R(x, base - h, w, 1, C.sand);
    R(x + Math.floor(w / 2), base - h, 1, h, C.rust);
    R(x, base - Math.floor(h / 2), w, 1, C.rust);
  }
  function tunnel(x1, x2, base) {
    R(x1, base - 10, x2 - x1, 10, C.navy);
    R(x1, base - 9, x2 - x1, 8, C.lgrey);
    R(x1, base - 9, x2 - x1, 2, C.bone);
    R(x1, base - 3, x2 - x1, 2, C.grey);
    for (let x = x1 + 4; x < x2; x += 6) R(x, base - 9, 1, 8, C.grey);
  }
  function habitat(x, base, w, h, f, lit) {
    const y = base - h;
    for (let r = 0; r < 6; r++) {
      const ins = 6 - r;
      R(x + ins - 1, y - 6 + r, w - 2 * ins + 2, 1, C.navy);
      R(x + ins, y - 6 + r + 1, w - 2 * ins, 1, r === 0 ? C.bone : C.lgrey);
    }
    R(x - 1, y - 1, w + 2, h + 1, C.navy);
    R(x, y, w, h, C.lgrey);
    R(x, y, w, 2, C.bone);
    R(x, base - 5, w, 5, C.grey);
    for (let i = x + 12; i < x + w - 6; i += 14) R(i, y + 2, 1, h - 7, C.grey);
    for (let i = x + 4; i < x + w - 16; i += 14) {
      R(i - 1, y + 7, 9, 9, C.navy);
      R(i, y + 8, 7, 7, lit ? (f % 12 === 0 ? C.sand : C.yellow) : C.deep);
      R(i, y + 8, 7, 1, C.bone);
    }
    R(x + w - 12, base - 14, 9, 14, C.navy);
    R(x + w - 11, base - 13, 7, 12, C.dgrey);
    R(x + w - 8, base - 9, 1, 3, C.yellow);
  }
  function tank(x, base, w, h, pct, f) {
    R(x - 1, base - h - 1, w + 2, h + 1, C.navy);
    R(x, base - h, w, h, C.lgrey);
    R(x, base - h, 2, h, C.bone);
    R(x + w - 3, base - h, 3, h, C.grey);
    R(x + 2, base - h + 5, w - 5, h - 12, C.navy);
    const lvl = Math.round(((h - 14) * clamp(pct, 0, 100)) / 100);
    if (lvl > 0) {
      R(x + 3, base - 7 - lvl, w - 7, lvl, C.cyan);
      R(x + 3, base - 7 - lvl, w - 7, 1, C.lcyan);
      if (lvl > 4) R(x + 4 + ((f >> 1) % 3), base - 8 - ((f * 2) % Math.max(lvl - 1, 2)), 1, 1, C.bone);
    }
    R(x + 2, base - h - 3, w - 4, 3, C.grey);
    R(x + 3, base - h - 5, w - 6, 2, C.dgrey);
  }
  function panel(x, base, w, h, f, on, idx) {
    R(x + Math.floor(w / 2) - 1, base - 7, 3, 7, C.grey);
    R(x + Math.floor(w / 2) - 4, base - 2, 9, 2, C.dgrey);
    const sk = 5;
    for (let r = 0; r < h; r++) {
      const off = Math.round(((h - 1 - r) * sk) / h);
      const y = base - 7 - h + r;
      R(x + off - 1, y, w + 2, 1, C.navy);
      R(x + off, y, w, 1, on ? C.dblue : '#2a2a58');
      for (let c = 6; c < w; c += 6) R(x + off + c, y, 1, 1, on ? C.blue : '#3a3a78');
      if (r % 4 === 0) R(x + off, y, w, 1, on ? C.blue : '#3a3a78');
    }
    if (on) {
      const sh = (f * 3 + idx * 7) % (w + h);
      for (let r = 0; r < h; r++) {
        const off = Math.round(((h - 1 - r) * sk) / h);
        const cx = sh - r;
        if (cx >= 0 && cx < w) R(x + off + cx, base - 7 - h + r, 1, 1, C.lcyan);
      }
    }
  }
  // A rotating dish. Returns where the feed horn is, so signals can start from it.
  function dish(cx, base, f, tilt) {
    R(cx - 1, base - 26, 3, 26, C.grey);
    R(cx - 8, base - 3, 17, 3, C.dgrey);
    R(cx - 5, base - 8, 3, 8, C.dgrey);
    R(cx + 3, base - 8, 3, 8, C.dgrey);
    const py = base - 28;
    for (let t = -20; t <= 20; t++) {
      const ly = -(t * t) / 40;
      const x = cx + t * Math.cos(tilt) - ly * Math.sin(tilt);
      const y = py + t * Math.sin(tilt) + ly * Math.cos(tilt);
      R(x, y, 2, 2, C.lgrey);
      R(x, y + 2, 2, 1, C.grey);
    }
    const ex = cx + 14 * Math.sin(tilt);
    const ey = py - 14 * Math.cos(tilt);
    for (let k = 0; k <= 7; k++) R(cx + (ex - cx) * (k / 7), py + (ey - py) * (k / 7), 1, 1, C.grey);
    R(ex - 1, ey - 1, 3, 3, f % 4 < 2 ? C.yellow : C.orange);
    return { fx: ex, fy: ey };
  }
  function glassHouse(x, base, w, h, f, stage, wilt, bright) {
    const ht = (c) => h * Math.sqrt(Math.max(0, 1 - ((c - w / 2) / (w / 2)) ** 2));
    for (let c = 0; c < w; c++) {
      const t = Math.round(ht(c));
      R(x + c, base - t, 1, t, '#17505c');
      R(x + c, base - Math.round(t * 0.5), 1, Math.round(t * 0.5), '#1d6370');
    }
    for (let c = 0; c < w; c++) {
      const t = Math.round(ht(c));
      R(x + c, base - t - 1, 1, 2, C.lcyan);
      if (c % 18 === 0) R(x + c, base - t, 1, t, C.grey);
    }
    R(x, base - 2, w, 2, C.dgrey);
    const gl = (f * 2) % (w + 20);
    for (let r = 0; r < h - 2; r++) {
      const cx = gl - r;
      if (cx > 2 && cx < w - 2 && r < ht(cx) - 2) R(x + cx, base - 4 - r, 1, 1, C.bone);
    }
    const barY = base - Math.round(h * 0.7);
    for (let c = 4; c < w - 4; c++) if (ht(c) > h * 0.7 + 2) R(x + c, barY, 1, 2, '#b04fd1');
    for (let k = 0; k < 12; k++) {
      const px2 = x + 8 + ((k * 13 + f * 2) % (w - 16));
      const py = base - h + 12 + ((k * 7 + f) % 22);
      if (bright) R(px2, py, 1, 1, '#d98fe8');
    }
    const n = 4;
    for (let i = 0; i < n; i++) {
      const cx = x + Math.round(((i + 0.5) * w) / n);
      R(cx - 12, base - 8, 24, 6, C.navy);
      R(cx - 11, base - 7, 22, 5, C.rust);
      R(cx - 11, base - 7, 22, 1, C.orange);
      plantBig(cx, base - 7, stage, wilt, f);
    }
  }
  function plantBig(cx, yb, stage, wilt, f) {
    const gcol = wilt ? C.yellow : C.green;
    const h = [0, 8, 14, 20][stage];
    const sway = [0, 0, 1, 0][f % 4];
    const dr = wilt ? 3 : 0;
    if (stage === 0) {
      R(cx - 2, yb - 1, 4, 1, C.sand);
      return;
    }
    R(cx, yb - h, 2, h, gcol);
    R(cx - 4 + sway, yb - h + 2 + dr, 4, 2, gcol);
    R(cx + 2 + sway, yb - h + dr, 4, 2, gcol);
    if (stage >= 2) {
      R(cx - 6 + sway, yb - 7 + dr, 6, 2, gcol);
      R(cx + 2 + sway, yb - 9 + dr, 6, 2, gcol);
    }
    if (stage >= 3 && !wilt) {
      R(cx - 7, yb - 5, 3, 3, C.red);
      R(cx + 5, yb - 11, 3, 3, C.red);
      R(cx - 6, yb - 5, 1, 1, C.bone);
      R(cx + 6, yb - 11, 1, 1, C.bone);
    }
  }

  const SCENES = {
    // Life Support: habitat, oxygen generator with a fan and steam, two tanks
    life(st, f) {
      outdoor(0);
      const ok = good(st.res);
      const bad = st.res === 'bad';
      const rt = st.rt;
      const calm = st.res === 'intro';
      habitat(14, 102, 64, 30, f, true);
      R(44, 63, 6, 6, C.navy);
      R(45, 64, 4, 4, ok ? C.green : calm ? (f % 6 < 3 ? C.red : C.dred) : f % 2 ? C.red : C.dred);
      tunnel(78, 110, 102);
      R(109, 59, 52, 43, C.navy);
      R(110, 60, 50, 41, C.grey);
      R(110, 60, 50, 3, C.lgrey);
      R(110, 96, 50, 5, C.dgrey);
      fan(135, 80, 12, bad ? (f % 8 === 0 ? 1 : 0) : f);
      const seg = ok ? Math.min(8, 3 + Math.floor(rt / 3)) : bad ? 1 : calm ? 3 : 2;
      for (let i = 0; i < 8; i++) R(114 + i * 5, 66, 4, 4, i < seg ? (seg <= 2 ? C.red : C.green) : C.navy);
      [124, 146].forEach((px) => R(px, 54, 5, 6, C.dgrey));
      const puffs = ok ? 4 : bad ? 1 : 3;
      const col = bad ? [C.dgrey, C.grey] : [C.lgrey, C.bone];
      steam(126, 54, f, puffs, col);
      steam(148, 54, f + 9, puffs, col);
      R(160, 90, 14, 3, C.dgrey);
      const pct = ok ? Math.min(100, 40 + rt * 3) : bad ? Math.max(5, 40 - rt) : 40;
      tank(172, 102, 18, 40, pct, f);
      tank(194, 102, 18, 32, pct, f + 3);
      R(190, 96, 4, 3, C.dgrey);
      crate(218, 102, 11, 9);
      crate(230, 102, 8, 7);
      crate(224, 93, 9, 7);
      drawAstro(96, 120, ok ? 'cheer' : bad ? 'worried' : 'idle', 1, f);
    },
    // Radiation Shelter: the reference scene
    rad(st, f) {
      outdoor(0);
      const ok = good(st.res);
      const bad = st.res === 'bad';
      const sx = 190;
      const sy = 26;
      circle(sx, sy, 8, C.yellow);
      circle(sx, sy, 5, C.bone);
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4 + (f % 2) * 0.2;
        const len = 10 + ((f + k * 3) % 7);
        for (let i = 10; i < len + 6; i++) R(sx + Math.cos(a) * i, sy + Math.sin(a) * i, 1, 1, i > 14 ? C.orange : C.yellow);
      }
      const dx = 110;
      const dy = 98;
      const N = Math.min(70, Math.round(((ok ? 40 : 46) * (VX1 - VX0)) / 240));
      const sparks = [];
      for (let i = 0; i < N; i++) {
        const s = 1 + (i % 3) * 0.5;
        const span = VX1 - VX0 + 40;
        const top = Math.min(0, VY0);
        const hh = 100 - top;
        const x = ((((PX[i] * span - f * 3 * s) % span) + span) % span) + VX0 - 20;
        const y = top + ((PY[i] * hh + f * 1.8 * s) % hh);
        const d = Math.hypot(x - dx, y - dy);
        if (ok && d < 35 && y < dy) {
          sparks.push([x, y]);
          continue;
        }
        R(x, y, 2, 1, C.yellow);
        R(x + 1, y - 1, 1, 1, C.orange);
        R(x + 2, y - 2, 1, 1, C.orange);
      }
      R(80, 98, 60, 6, C.dgrey);
      R(80, 98, 60, 1, C.grey);
      for (let y = -26; y <= 0; y++) for (let x = -26; x <= 26; x++) {
        const d = x * x + y * y;
        if (d <= 676) R(dx + x, dy + y, 1, 1, d > 600 ? C.lgrey : C.dblue);
      }
      const hit = bad && f % 2 === 0;
      [-14, 0, 14].forEach((wx) => {
        R(dx + wx - 3, dy - 14, 7, 6, C.navy);
        R(dx + wx - 2, dy - 13, 5, 4, hit ? C.red : C.yellow);
      });
      R(dx - 4, dy - 6, 9, 6, C.navy);
      if (ok) for (let a = Math.PI; a <= 2 * Math.PI; a += 0.025) {
        const px = dx + Math.cos(a) * 34;
        const py = dy + Math.sin(a) * 34;
        if (((Math.floor(px) + Math.floor(py) + f) & 1) === 0) R(px, py, 1, 1, C.cyan);
      }
      sparks.forEach(([x, y]) => {
        R(x, y, 2, 2, C.lcyan);
        R(x - 1, y + 1, 1, 1, C.cyan);
        R(x + 2, y - 1, 1, 1, C.cyan);
      });
      if (bad) for (let i = 0; i < 4; i++) R(dx - 30 + ((f * 7 + i * 17) % 60), dy - 24 + ((i * 9) % 20), 2, 2, C.orange);
      drawAstro(40, 116, ok ? 'cheer' : 'worried', 1, f);
    },
    // Power Budget: a solar field in three rows, a cable, and a battery hub
    power(st, f) {
      outdoor(1);
      const ok = good(st.res);
      const bad = st.res === 'bad';
      const rt = st.rt;
      const on = !(bad && rt > 12);
      const rows = [
        { base: 92, w: 16, h: 7, xs: [6, 30, 54, 78, 102, 126, 150] },
        { base: 103, w: 21, h: 9, xs: [2, 34, 66, 98, 130] },
        { base: 117, w: 27, h: 11, xs: [0, 40, 80, 120] },
      ];
      rows.forEach((row, ri) => row.xs.forEach((x, i) => panel(x, row.base, row.w, row.h, f, on, i + ri * 3)));
      R(0, 119, 196, 2, C.navy);
      R(0, 119, 196, 1, C.dgrey);
      const speed = ok ? 4 : bad ? 0 : 1.5;
      for (let k = 0; k < 7; k++) {
        const x = (k * 30 + f * speed * 3) % 196;
        if (speed > 0 || k % 3 === 0) R(x, 119, 4, 1, on ? C.yellow : C.deep);
      }
      R(193, 69, 41, 53, C.navy);
      R(194, 70, 39, 51, C.lgrey);
      R(194, 70, 39, 3, C.bone);
      R(194, 112, 39, 9, C.grey);
      for (let i = 0; i < 3; i++) {
        R(198 + i * 12, 78, 8, 8, C.navy);
        R(199 + i * 12, 79, 6, 6, on ? C.yellow : C.deep);
      }
      const seg = ok ? Math.min(6, 2 + Math.floor(rt / 4)) : bad ? Math.max(0, 2 - Math.floor(rt / 14)) : 1 + (f % 2);
      R(198, 92, 31, 18, C.navy);
      for (let i = 0; i < 6; i++) R(200 + i * 5, 94, 4, 14, i < seg ? (seg <= 2 ? C.red : C.green) : '#1a2a3a');
      R(212, 62, 2, 8, C.grey);
      R(211, 59, 4, 3, f % 6 < 3 ? C.yellow : C.deep);
      drawAstro(184, 122, ok ? 'cheer' : bad ? 'worried' : 'idle', -1, f);
    },
    // Greenhouse: a glass tunnel full of plants under grow lights, with a supply module
    green(st, f) {
      outdoor(0);
      const ok = good(st.res);
      const bad = st.res === 'bad';
      const rt = st.rt;
      const stage = ok ? clamp(1 + Math.floor(rt / 6), 0, 3) : bad ? clamp(1 + Math.floor(rt / 6), 0, 2) : 1;
      glassHouse(20, 104, 150, 46, f, stage, bad && rt > 20, ok || (bad && rt < 12) || st.res === 'intro');
      tunnel(168, 186, 104);
      habitat(186, 104, 48, 30, f, true);
      R(24, 62, 140, 1, C.dgrey);
      for (let i = 0; i < 4; i++) {
        const cx = 20 + Math.round(((i + 0.5) * 150) / 4);
        R(cx, 61, 3, 3, C.cyan);
        const dy = 64 + ((f * 5 + i * 7) % 34);
        if (dy < 94 && (ok || (bad && rt < 12))) R(cx + 1, dy, 1, 2, C.cyan);
      }
      crate(176, 118, 10, 8);
      drawAstro(206, 124, ok ? 'cheer' : 'idle', -1, f);
    },
    // Earth Is Far Away: a rotating dish under a night sky, Earth in the sky, signal packets
    msg(st, f) {
      outdoor(3, true);
      const ok = good(st.res);
      const bad = st.res === 'bad';
      const ex = 202;
      const ey = 38;
      circle(ex, ey, 11, C.blue);
      [[-6, -4, 5, 3], [2, 1, 6, 4], [-3, 5, 4, 2], [4, -7, 3, 2], [-9, 1, 3, 3]].forEach(([x, y, w, h]) => {
        const sx = ((((x + 12 + Math.floor(f / 2)) % 24) + 24) % 24) - 12;
        if (sx * sx + y * y < 80) R(ex + sx, ey + y, w, h, C.green);
      });
      R(ex - 7, ey - 9, 4, 2, C.lcyan);
      const d = dish(70, 104, f, 0.45 + Math.sin(f / 12) * 0.18);
      habitat(108, 104, 58, 28, f, true);
      R(128, 84, 24, 14, C.navy);
      R(129, 85, 22, 12, '#08122b');
      for (let i = 0; i < 22; i++) {
        const y = 91 + Math.round(Math.sin((i + f * 2) * 0.7) * (bad ? 1 + (f % 3) : 3));
        R(129 + i, y, 1, 1, bad ? C.red : C.green);
      }
      R(186, 64, 2, 40, C.grey);
      R(184, 61, 6, 3, f % 6 < 3 ? C.yellow : C.deep);
      R(185, 80, 4, 2, f % 6 < 3 ? C.red : C.deep);
      crate(172, 104, 10, 8);
      const ring = f % 6;
      if (ring) for (let a = -1.1; a < 0.2; a += 0.12) R(d.fx + Math.cos(a) * ring * 3, d.fy + Math.sin(a) * ring * 3, 1, 1, C.cyan);
      if (st.res !== 'intro') {
        for (let k = 0; k < 4; k++) {
          const u = (f * 0.04 + k * 0.25) % 1;
          if (bad && u > 0.5) continue;
          const x = d.fx + (ex - 14 - d.fx) * u;
          const y = d.fy + (ey - d.fy) * u - Math.sin(Math.PI * u) * 12;
          R(x, y, 3, 3, C.cyan);
          R(x + 1, y + 1, 1, 1, C.lcyan);
          R(x - 3, y + 1, 2, 1, C.dblue);
        }
      }
      if (bad) for (let i = 0; i < 20; i++) R(VX0 + ((i * 53 + f * 31) % (VX1 - VX0)), 4 + ((i * 17 + f * 7) % 14), 2, 1, C.grey);
      drawAstro(96, 122, ok ? 'cheer' : 'idle', 1, f);
    },
  };

  // ===================== layout =====================
  function setCanvas() {
    canvas.width = Wl;
    canvas.height = Hl;
    canvas.style.width = `${Wl * SCALE}px`;
    canvas.style.height = `${Hl * SCALE}px`;
  }

  // Dashboard. The page is a column: HUD, then the station, then the bottom block, one under
  // the other, so nothing can cover anything else. The canvas sits behind all of it and is as
  // tall as the page. `hudBottom` is where the station starts, `footH` the bottom block's height.
  function layoutDash(vw, vh, hudBottom, footH) {
    const phone = vw < 700;
    portrait = phone || vw / vh < 0.95;
    bw = portrait ? 2 * RW + GAP + 2 * PAD : 3 * RW + 2 * GAP + 2 * PAD;
    bh = (portrait ? 3 * RH + 2 * GAP + 2 * PAD : 2 * RH + GAP + 2 * PAD) + LABEL;
    const totW = bw + (portrait ? 0 : 2 * WING);
    const need = bh + 22; // the hull border and the antenna above it
    const byWidth = (vw - 24) / totW;
    const byHeight = (vh - hudBottom - footH) / need;
    let s = phone ? Math.min(byWidth, 4) : Math.min(byWidth, Math.max(byHeight, 3), 8);
    if (s >= 3) s = Math.floor(s);
    SCALE = Math.max(s, 1.5);
    by = Math.ceil((hudBottom + 6) / SCALE) + 16;
    const stageH = Math.ceil((by + bh + 4) * SCALE - hudBottom);
    const pageH = Math.max(vh, hudBottom + stageH + footH + 8);
    Wl = Math.ceil(vw / SCALE);
    Hl = Math.ceil(pageH / SCALE);
    OX = 0;
    OY = 0;
    VX0 = 0;
    VX1 = Wl;
    VY0 = 0;
    VY1 = Hl;
    bx = Math.floor((Wl - bw) / 2);
    const pos = portrait
      ? { life: [0, 0], rad: [1, 0], power: [0, 1], green: [1, 1], msg: [0.5, 2] }
      : { life: [0, 0], rad: [1, 0], power: [2, 0], green: [0.5, 1], msg: [1.5, 1] };
    rooms = {};
    Object.keys(pos).forEach((id) => {
      rooms[id] = { x: bx + PAD + Math.round(pos[id][0] * (RW + GAP)), y: by + PAD + Math.round(pos[id][1] * (RH + GAP)) };
    });
    dashStars = Array.from({ length: Math.round((Wl * Hl) / 420) }, () => ({
      x: Math.floor(Math.random() * Wl),
      y: Math.floor(Math.random() * Hl * 0.85),
      p: Math.floor(Math.random() * 5),
      b: Math.random() < 0.15,
    }));
    setCanvas();
    return { view: 'dash', scale: SCALE, rooms, portrait, phone, stageH };
  }

  // Challenge scene. Also a column: HUD, the scene, then the dialogue and options underneath.
  // The scene is 240 x 122 logical pixels and is centred; the ground carries on below it.
  function layoutStory(vw, vh, hudBottom, belowH) {
    const artH = 122;
    let s = Math.min(vw / 240, (vh * 0.46) / artH, 7);
    if (s >= 3) s = Math.floor(s);
    SCALE = Math.max(s, 1.5);
    const artPx = Math.ceil(artH * SCALE);
    const stageH = artPx + 8;
    const pageH = Math.max(vh, hudBottom + stageH + belowH + 8);
    Wl = Math.ceil(vw / SCALE);
    Hl = Math.ceil(pageH / SCALE);
    OX = Math.floor((Wl - 240) / 2);
    OY = Math.ceil((hudBottom + 4) / SCALE);
    VX0 = -OX;
    VX1 = Wl - OX;
    VY0 = -OY;
    VY1 = Hl - OY;
    setCanvas();
    return { view: 'story', scale: SCALE, stageH };
  }

  function draw(scene) {
    S = scene;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, Wl, Hl);
    if (scene.view === 'story') {
      g.setTransform(1, 0, 0, 1, OX, OY);
      (SCENES[scene.storyId] || (() => {}))(scene.story, F());
    } else {
      drawDash();
    }
  }

  return { layoutDash, layoutStory, draw };
}
