// Pixel scenes for the Intro, drawn on small canvases (320 x 180 for scenes, 112 x 72 for rooms).
// Plain drawing code: no React and no game rules. Ported from the approved prototype.

export const SCENE_W = 320;
export const SCENE_H = 180;
export const ROOM_W = 112;
export const ROOM_H = 72;

let g = null;
let T = 0;
const R = (a, b, w, h, c) => {
  g.fillStyle = c;
  g.fillRect(Math.round(a), Math.round(b), Math.round(w), Math.round(h));
};
const disc = (cx, cy, r, c) => {
  g.fillStyle = c;
  for (let y = -r; y <= r; y++) {
    const w = Math.floor(Math.sqrt(r * r - y * y));
    g.fillRect(cx - w, cy + y, 2 * w + 1, 1);
  }
};
const blit = (grid, pal, x, y) =>
  grid.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const c = pal[row[i]];
      if (c) R(x + i, y + j, 1, 1, c);
    }
  });

// fixed pseudo-random stars so the sky does not jump between redraws
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const STARS = Array.from({ length: 80 }, () => [(rnd() * SCENE_W) | 0, (rnd() * 100) | 0, rnd() < 0.2 ? 2 : 1]);

function sky(cols, y1) {
  const n = cols.length;
  const h = y1 / n;
  cols.forEach((c, i) => {
    R(0, i * h, SCENE_W, h + 1, c);
    if (i < n - 1) {
      for (let x = 0; x < SCENE_W; x += 2) {
        R(x + (i % 2), (i + 1) * h - 2, 1, 1, cols[i + 1]);
        R(x + 1 - (i % 2), (i + 1) * h - 1, 1, 1, cols[i + 1]);
      }
    }
  });
}
function stars() {
  STARS.forEach((s, i) => {
    if ((i + T) % 9 !== 0) R(s[0], s[1], s[2], s[2], i % 5 ? '#fff' : '#ffd9bf');
  });
}
function ridge(col, base, amp, k, hor) {
  for (let x = 0; x < SCENE_W; x++) {
    const h = base - amp * ((0.5 + 0.05) * Math.sin(x / k + 1) + 0.3 * Math.sin(x / (k * 0.37) + 2) + 0.15 * Math.sin(x / (k * 0.15)));
    R(x, h, 1, hor - h + 1, col);
  }
}
function ground(y0) {
  R(0, y0, SCENE_W, SCENE_H - y0, '#c4562a');
  for (let y = y0 + 8; y < SCENE_H; y++) for (let x = y % 2; x < SCENE_W; x += 2) R(x, y, 1, 1, y < y0 + 28 ? '#b84e26' : '#a3421f');
  R(0, y0 + 34, SCENE_W, SCENE_H, '#a3421f');
  for (let y = y0 + 34; y < SCENE_H; y++) for (let x = y % 2; x < SCENE_W; x += 2) R(x, y, 1, 1, '#8c3a1d');
  [[28, y0 + 14, 10], [90, y0 + 40, 14], [210, y0 + 22, 8], [270, y0 + 46, 12], [150, y0 + 28, 6]].forEach((r) => {
    R(r[0], r[1], r[2], 3, '#7a2f1a');
    R(r[0] + 1, r[1] - 2, r[2] - 2, 2, '#d9703a');
  });
}
function base(x0, y0, shield) {
  for (let y = 0; y <= 20; y++) {
    const w = Math.floor(Math.sqrt(400 - y * y));
    R(x0 - w, y0 - y, 2 * w + 1, 1, y > 16 ? '#7a8be8' : '#3c4a9e');
  }
  for (let y = 1; y <= 16; y++) {
    const w = Math.floor(Math.sqrt(256 - y * y));
    R(x0 - w, y0 - y, 2 * w + 1, 1, y % 4 ? '#3c4a9e' : '#4a5cc4');
  }
  R(x0 - 8, y0 - 12, 5, 5, '#0d1531');
  R(x0 + 3, y0 - 12, 5, 5, T % 6 < 3 ? '#ffd23f' : '#0d1531');
  R(x0 - 3, y0 - 6, 6, 6, '#ff8a3d');
  R(x0 + 20, y0 - 10, 44, 10, '#b8bcc9');
  R(x0 + 20, y0 - 10, 44, 2, '#eef0f6');
  [26, 40, 52].forEach((dx) => R(x0 + dx, y0 - 7, 8, 5, '#3a8bff'));
  R(x0 + 16, y0 - 5, 6, 4, '#8d93a8');
  R(x0 - 58, y0 - 4, 34, 5, '#2d3f8a');
  for (let i = 0; i < 5; i++) R(x0 - 58 + i * 7, y0 - 4, 1, 5, '#6a8bff');
  R(x0 - 42, y0 + 1, 2, 6, '#8d93a8');
  R(x0 + 44, y0 - 28, 2, 18, '#d9b48a');
  R(x0 + 40, y0 - 34, 10, 3, '#e9c9a8');
  R(x0 + 38, y0 - 36, 3, 3, '#e9c9a8');
  R(x0 + 49, y0 - 36, 3, 3, '#e9c9a8');
  if (shield) {
    for (let a = 0; a < Math.PI; a += 0.1) {
      if ((((a * 10) | 0) + T) % 2) continue;
      R(x0 + Math.cos(a) * 34, y0 - Math.sin(a) * 34, 2, 2, '#4fd6ff');
    }
  }
}

// crew colours for the Mars scene (same suits as the portraits)
const CREW = ['mira', 'kai', 'zuri', 'leo'];
const SUIT = { mira: '#ff5a7a', kai: '#ffc83d', zuri: '#4fd98a', leo: '#5aa8ff' };
const ASTRO = [
  '....wwww....', '...WWWWWW...', '..WWBBBBWw..', '..WBBHHBBw..', '..WBBBBBBw..', '..WWBBBBWw..', '...WWWWWw...',
  '.A.WWSSWw.A.', '.AWWWSSWwwA.', '.AWWWWWWwwA.', '.AWWWWWWww..', '..WWWWWWww..', '...WW..ww...', '...WW..ww...',
  '..SSS..SSs..', '..SSS..SSs..',
];
const crewPal = (k) => ({ W: '#f4f4f8', w: '#c4c8d6', A: '#8d93a8', B: '#1f3a8a', H: '#7fc4ff', S: SUIT[k], s: SUIT[k] });

const SCENES = {
  // Mission Control on Earth: a big screen showing Earth and Mars, and four operators
  control() {
    R(0, 0, SCENE_W, SCENE_H, '#0a0e1f');
    R(28, 10, 260, 98, '#6b4129');
    R(33, 13, 254, 92, '#f2a06f');
    R(36, 16, 248, 86, '#0d1531');
    disc(92, 58, 28, '#2f7fe0');
    [[80, 48, 8], [100, 64, 7], [88, 70, 4], [104, 46, 3]].forEach((p) => disc(p[0], p[1], p[2], '#47c279'));
    disc((23 * 10), 58, 18, '#d4602f');
    disc(224, 52, 4, '#a8421f');
    disc(238, 64, 3, '#a8421f');
    for (let x = 126; x < 204; x += 8) R(x + ((T * 2) % 8), 58, 4, 3, '#ff9a6a');
    R(100, 92, 120, 6, '#1d2f66');
    R(102, 94, ((T % 10) + 1) * 11, 2, '#4fd6ff');
    for (let i = 0; i < 7; i++) R(20 + i * 44, 2, 16, 4, T % 4 === i % 4 ? '#fff3a0' : '#ffd84a');
    R(0, 112, SCENE_W, SCENE_H, '#141c3e');
    for (let y = 112; y < SCENE_H; y += 2) for (let x = y % 4; x < SCENE_W; x += 4) R(x, y, 1, 1, '#1c2754');
    [58, (13 * 10), 200, 272].forEach((x, i) => {
      R(x - 22, 140, 50, 26, '#3a2417');
      R(x - 16, 126, 38, 20, '#1f2f63');
      R(x - 13, 129, 32, 14, (T + i) % 5 ? '#3d7fe0' : '#6fb0ff');
      R(x - 2, 112, 8, 8, ['#c98f64', '#8a5a3b', '#e5b48a', '#a66d48'][i]);
      R(x - 2, 110, 8, 3, '#1c1c2a');
      R(x - 3, 114, 1, 4, '#fff');
      R(x + 6, 114, 1, 4, '#fff');
      R(x - 4, 121, 12, 6, '#2d3f8a');
    });
  },
  // The outpost on Mars at dusk, with the four astronauts
  mars() {
    sky(['#0b0716', '#1a0d26', '#2e1231', '#4d1a2e', '#7a2a2c', '#a8402c', '#d26a35'], 120);
    stars();
    disc(250, 48, 7, '#ffe9a0');
    disc(250, 48, 10, T % 2 ? '#ffcf6a22' : '#ffcf6a44');
    disc(58, 36, 3, '#d8c8c0');
    ridge('#6a2420', 96, 16, 23, (13 * 10));
    ridge('#8c3524', 108, 10, 17, (13 * 10));
    ground(120);
    base(148, 128, false);
    CREW.forEach((k, i) => blit(ASTRO, crewPal(k), 200 + i * 20, 112 + (i % 2) * 3 - ((T + i) % 4 < 2 ? 1 : 0)));
    for (let i = 0; i < 5; i++) R(((T * 3 + i * 70) % 340) - 10, 150 + i * 6, 3 + (i % 2), 2, '#e9a37e');
  },
  // The same outpost during a solar storm, with a shield over it
  storm() {
    sky(['#1a0a26', '#2a0f2e', '#4a1631', '#6e2231', '#8c2f2c', '#b04a2c', '#d2713a'], 120);
    stars();
    disc(262, 38, 18, '#ffb347');
    disc(262, 38, 13, '#fff0b8');
    disc(262, 38, T % 2 ? 23 : 21, '#ff8a3d33');
    for (let i = 0; i < 7; i++) {
      const p = (T * 9 + i * 22) % 150;
      R(250 - p * 1.2 - i * 5, 50 + p * 0.6 + i * 3, 10, 2, '#ffe08a');
      R(246 - p * 1.2 - i * 5, 52 + p * 0.6 + i * 3, 5, 2, '#ff9a3d');
    }
    ridge('#5a1c22', 100, 14, 21, (13 * 10));
    ridge('#7a2a24', 110, 9, 15, (13 * 10));
    ground(120);
    base(148, 128, true);
  },
};

export function drawScene(ctx, name, tick) {
  g = ctx;
  T = tick;
  g.imageSmoothingEnabled = false;
  SCENES[name]();
}

// Room art for each challenge id (112 x 72), same look as the Dashboard rooms.
const ROOMS = {
  L() {
    R(18, 14, 22, 44, '#b8bcc9');
    R(22, 18, 14, 10, '#111');
    R(22, (3 * 10), 14, 24, '#4fe0ff');
    R(24, 8, 5, 5, '#6bd44a');
    R(46, 26, (3 * 10), 32, '#2d3f8a');
    R(50, 40, 22, 14, '#4fd6ff');
    R(46, 26, (3 * 10), 6, '#1c2a60');
    disc(92, 34, 9, '#3b3b3b');
    disc(92, 34, 3, '#1c1210');
  },
  R() {
    R(44, 46, 24, 12, '#8a7a6a');
    R(22, 42, 12, 16, '#2a1a12');
    R(80, 42, 12, 16, '#2a1a12');
    R(26, 48, 4, 3, '#ff8a3d');
    R(84, 48, 4, 3, '#ff8a3d');
    R(54, 40, 4, 6, '#c9b8a8');
    [14, 24, 34].forEach((r, i) => {
      for (let a = 0; a < Math.PI; a += 0.16 - i * 0.03) R(56 + Math.cos(a) * r * 1.4, 46 - Math.sin(a) * r, 2, 2, '#4fd6ff');
    });
  },
  W() {
    R(36, 12, (3 * 10), 46, '#6b5a4d');
    R(44, 8, 14, 5, '#8a7a6a');
    for (let i = 0; i < 4; i++) R(40, 17 + i * 10, 22, 7, '#6bd44a');
    R(76, 22, 12, 6, '#fff');
    R(72, 28, 10, 6, '#fff');
    R(78, 34, 8, 10, '#fff');
    R(90, 14, 18, 16, '#2d5fd0');
    for (let i = 0; i < 3; i++) R(90 + i * 6, 14, 1, 16, '#8fb0ff');
    R(97, (3 * 10), 3, 28, '#a89a8a');
  },
  G() {
    [10, 42, 74].forEach((x) => {
      R(x, 50, 28, 10, '#8a4a2a');
      R(x, 8, 28, 6, '#3a3a3a');
      R(x + 3, 14, 22, 3, '#a050ff');
      for (let y = 18; y < 48; y += 3) for (let xx = x + ((y / 3) % 2) * 2 + 5; xx < x + 23; xx += 4) R(xx, y, 1, 1, '#a050ff');
      R(x + 13, 34, 3, 16, '#6bd44a');
      R(x + 7, 36, 6, 3, '#6bd44a');
      R(x + 16, 40, 6, 3, '#6bd44a');
    });
  },
  M() {
    R(12, 28, 36, 32, '#0d1531');
    R(16, 34, 10, 3, '#6bd44a');
    R(16, 44, 20, 2, '#2d3f8a');
    R(58, 46, 4, 14, '#d9b48a');
    for (let a = 0.6; a < 2.6; a += 0.15) R(76 + Math.cos(a) * 16, 50 - Math.sin(a) * 16, 3, 3, '#d9b48a');
    R(92, 48, 5, 4, '#e9c9a8');
    disc(96, 14, 7, '#3a8bff');
    disc(94, 12, 2, '#8fc9ff');
    R(92, 24, 2, 16, '#4fd6ff');
    R(98, 28, 2, 12, '#4fd6ff');
  },
};

export function drawRoom(ctx, id) {
  g = ctx;
  g.imageSmoothingEnabled = false;
  R(0, 0, ROOM_W, ROOM_H, '#1c1210');
  R(0, 58, ROOM_W, 14, '#3a2417');
  R(0, 58, ROOM_W, 2, '#5a3a28');
  ROOMS[id]();
}
