import { useEffect, useRef } from 'react';

// Animated pixel backdrop for the Title screen: night sky, a slowly turning Mars with a moon,
// twinkling stars, floating cubes, an occasional shooting star, craters and a rocket on the pad.
// Drawn on a small canvas (one canvas pixel = PX screen pixels) and scaled up, so it stays crisp.
// Decorative only. With "reduce motion" it is drawn once and nothing moves.

const rng = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const R = (c, x, y, w, h, col) => {
  c.fillStyle = col;
  c.fillRect(Math.round(x), Math.round(y), w, h);
};

const ROCKET = ['...a...', '..aaa..', '..awa..', '.aaaaa.', '.aawaa.', '.aaaaa.', '.aaaaa.', 'raaaaar', 'r.aaa.r', '..ddd..'];
const ROCKET_COLORS = { a: '#eceaf6', w: '#4fb8ff', r: '#e2402b', d: '#6a6a8a' };
const BANDS = ['#06051a', '#0a0829', '#100c38', '#171048', '#211556', '#33195a', '#4f2253'];
const MARS_PALETTE = ['#3d1220', '#6e2220', '#a8401f', '#d2602a', '#ee8a3e', '#f9b86a'];

export default function TitleScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv.getContext('2d');
    const bg = document.createElement('canvas');
    const bx = bg.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, PX, gy, stars, cubes, rx;
    let shoot = null;
    let nextShoot = 3;
    let raf = 0;

    function crater(cx, cy, a, b) {
      for (let y = cy - b - 1; y <= cy + b + 2; y++) {
        for (let x = cx - a - 1; x <= cx + a + 1; x++) {
          const u = ((x - cx) / a) ** 2 + ((y - cy) / b) ** 2;
          if (u > 1) continue;
          R(bx, x, y, 1, 1, u > 0.6 ? (y < cy ? '#c26a45' : '#9a472f') : y > cy ? '#5a2322' : '#3a1416');
        }
      }
    }

    function drawBg(r) {
      const bh = gy / BANDS.length;
      BANDS.forEach((c, i) => R(bx, 0, Math.floor(i * bh), W, Math.ceil(bh) + 1, c));
      for (let i = 1; i < BANDS.length; i++) {
        const y = Math.floor(i * bh);
        for (let x = 0; x < W; x++) {
          if (x % 2) R(bx, x, y, 1, 1, BANDS[i - 1]);
          else R(bx, x, y - 1, 1, 1, BANDS[i]);
        }
      }
      const ground = ['#8a3a28', '#74301f', '#5f281f', '#4a1f1d'];
      const gh = H - gy;
      for (let x = 0; x < W; x++) {
        const top = gy + Math.round(Math.sin(x * 0.06) * 1.3 + Math.sin(x * 0.17) * 0.9);
        ground.forEach((c, i) => {
          const y0 = Math.max(top, gy + Math.floor((i * gh) / 4));
          R(bx, x, y0, 1, H - y0, c);
        });
        R(bx, x, top, 1, 1, '#c26a45');
      }
      Array.from({ length: 9 }, () => ({ fx: r(), fy: r() }))
        .sort((a, b) => a.fy - b.fy)
        .forEach(({ fx, fy }) => {
          const a = Math.round(W * (0.03 + 0.07 * fy));
          crater(Math.round(fx * W), Math.round(gy + gh * (0.2 + 0.7 * fy)), a, Math.max(2, Math.round(a * 0.3)));
        });
    }

    function resize() {
      PX = Math.max(2, Math.round(Math.min(innerWidth / 220, innerHeight / 150)));
      W = Math.ceil(innerWidth / PX);
      H = Math.ceil(innerHeight / PX);
      for (const c of [cv, bg]) {
        c.width = W;
        c.height = H;
      }
      cv.style.width = `${W * PX}px`;
      cv.style.height = `${H * PX}px`;
      ctx.imageSmoothingEnabled = false;
      gy = Math.round(H * 0.8);
      const r = rng(11);
      stars = Array.from({ length: Math.round((W * H) / 360) }, () => ({
        x: (r() * W) | 0,
        y: (r() * gy * 0.92) | 0,
        p: r() * 6.3,
        s: 1 + r() * 2.5,
        k: r() < 0.1,
        c: ['#ffffff', '#a9b8ff', '#ffb870', '#7fe8ff'][(r() * 4) | 0],
      }));
      cubes = [
        ['#3d7bff', 0.18, 0.2],
        ['#8a5cff', 0.8, 0.3],
        ['#ff4d4d', 0.9, 0.55],
        ['#3dd6ff', 0.1, 0.5],
        ['#8a5cff', 0.62, 0.12],
      ].map(([c, x, y], i) => ({ c, x: x * W, y: y * gy, p: i * 1.7 }));
      rx = Math.round(W * 0.84);
      drawBg(r);
    }

    function mars(t) {
      const cx = W >> 1;
      const cy = Math.round(H * 0.33);
      const Rr = Math.round(Math.min(W * 0.2, H * 0.19));
      for (let y = -Rr; y <= Rr; y++) {
        for (let x = -Rr; x <= Rr; x++) {
          const dx = x / Rr;
          const dy = y / Rr;
          const d = dx * dx + dy * dy;
          if (d > 1) {
            if (d < 1.12 && (x + y) % 2 === 0) R(ctx, cx + x, cy + y, 1, 1, '#7a3a5e');
            continue;
          }
          const nz = Math.sqrt(1 - d);
          const lon = Math.atan2(dx, nz) + t * 0.12;
          if (dy < -0.84 && nz > 0.25) {
            R(ctx, cx + x, cy + y, 1, 1, '#e9e3f5');
            continue;
          }
          const v = Math.sin(lon * 3 + Math.sin(dy * 4) * 1.4) + Math.sin(lon * 8 + dy * 3) * 0.5;
          const l = -dx * 0.5 - dy * 0.45 + nz * 0.75;
          const i = Math.max(0, Math.min(MARS_PALETTE.length - 1, Math.floor((l * 0.85 + v * 0.09 + 0.08) * MARS_PALETTE.length)));
          R(ctx, cx + x, cy + y, 1, 1, MARS_PALETTE[i]);
        }
      }
      return { cx, cy, Rr };
    }

    function moon(m, a) {
      const mx = m.cx + Math.cos(a) * m.Rr * 1.7;
      const my = m.cy + Math.sin(a) * m.Rr * 0.35 - m.Rr * 0.1;
      for (let y = -3; y <= 3; y++) {
        for (let x = -3; x <= 3; x++) {
          const d = x * x + y * y;
          if (d <= 9) R(ctx, mx + x, my + y, 1, 1, d > 5 ? '#7a6a80' : x + y < 0 ? '#d9c9d9' : '#a898ab');
        }
      }
    }

    function rocket() {
      const base = gy + Math.round((H - gy) * 0.32);
      const S = Math.max(2, Math.round(Math.min(W, H) / 50));
      const x = rx - 3 * S;
      const y = base - 10 * S;
      ROCKET.forEach((row, j) =>
        [...row].forEach((ch, i) => {
          if (ch !== '.') R(ctx, x + i * S, y + j * S, S, S, ROCKET_COLORS[ch]);
        }),
      );
    }

    function frame(ms) {
      const t = ms / 1000;
      const tt = reduce ? 0 : t;
      ctx.drawImage(bg, 0, 0);
      for (const s of stars) {
        const b = reduce ? 1 : (Math.sin(tt * s.s + s.p) + 1) / 2;
        if (b < 0.25) continue;
        ctx.globalAlpha = 0.4 + 0.6 * b;
        if (s.k) {
          R(ctx, s.x, s.y - 2, 1, 5, s.c);
          R(ctx, s.x - 2, s.y, 5, 1, s.c);
          R(ctx, s.x, s.y, 1, 1, '#fff');
        } else R(ctx, s.x, s.y, 1, 1, s.c);
      }
      ctx.globalAlpha = 1;
      for (const c of cubes) {
        const y = c.y + Math.sin(tt * 0.6 + c.p) * 3;
        R(ctx, c.x, y, 4, 4, c.c);
        ctx.globalAlpha = 0.55;
        R(ctx, c.x, y, 4, 1, '#fff');
        R(ctx, c.x, y, 1, 4, '#fff');
        ctx.globalAlpha = 1;
      }
      if (!reduce) {
        if (!shoot && t > nextShoot) shoot = { x: Math.random() * W * 0.6, y: Math.random() * gy * 0.3, t };
        if (shoot) {
          const k = (t - shoot.t) * 80;
          for (let i = 0; i < 10; i++) {
            ctx.globalAlpha = 1 - i / 10;
            R(ctx, shoot.x + k - i, shoot.y + (k - i) * 0.5, 1, 1, '#fff');
          }
          ctx.globalAlpha = 1;
          if (k > W * 0.5) {
            shoot = null;
            nextShoot = t + 4 + Math.random() * 5;
          }
        }
      }
      const a = tt * 0.5;
      const front = Math.sin(a) >= 0;
      const m0 = { cx: W >> 1, cy: Math.round(H * 0.33), Rr: Math.round(Math.min(W * 0.2, H * 0.19)) };
      if (!front) moon(m0, a);
      mars(tt);
      if (front) moon(m0, a);
      rocket();
      if (!reduce) raf = requestAnimationFrame(frame);
    }

    resize();
    raf = requestAnimationFrame(frame);
    const onResize = () => {
      resize();
      if (reduce) raf = requestAnimationFrame(frame);
    };
    addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ts-canvas" aria-hidden="true" />;
}
