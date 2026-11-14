// ── NasaDrawer: the "How NASA handles this" pop-up ───────────────────────
// Opened from a Challenge screen button. Props: { challengeId, onClose }.
// All visible text/numbers come from src/data/nasaContent.js — nothing here
// is invented.
import { NASA_CONTENT, RADIATION_BARS } from '../data/nasaContent';

// Maps the `badge` field on each NASA_CONTENT entry to its icon + label.
const BADGE = {
  REAL: { icon: '🟦', label: 'REAL NASA' },
  GAME: { icon: '🟧', label: 'GAME NUMBERS' },
};

export default function NasaDrawer({ challengeId, onClose }) {
  // ── 1. Look up this challenge's content ──
  const content = NASA_CONTENT[challengeId];
  if (!content) return null;

  const badge = BADGE[content.badge] ?? BADGE.GAME;
  // Only the Radiation (R) drawer shows a bar chart.
  const maxBar =
    challengeId === 'R' ? Math.max(...RADIATION_BARS.map((bar) => bar.mSvPerDay)) : 0;

  return (
    <>
      {/* ── 2. Dark backdrop behind the drawer (click to close) ── */}
      <div className="nasa-drawer-backdrop" onClick={onClose} />

      {/* ── 3. The drawer itself ──
          Anchors under the trigger button when the parent wraps it in a
          position:relative container; the phone media query below
          overrides this to a full-screen sheet. */}
      <div className="nasa-drawer" role="dialog" aria-label="How NASA handles this">
        {/* 3a. Header: title + close button */}
        <div className="nasa-drawer-header">
          <h2>🛰 How NASA handles this</h2>
          <button
            type="button"
            className="nasa-drawer-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* 3b. REAL NASA / GAME NUMBERS badge */}
        <p className="nasa-drawer-badge">
          {badge.icon} {badge.label}
        </p>

        {/* 3c. Fact title + kid-friendly text */}
        <h3 className="nasa-drawer-title">{content.title}</h3>
        <p className="nasa-drawer-text">{content.text}</p>

        {/* 3d. Radiation-only bar chart, built from RADIATION_BARS */}
        {challengeId === 'R' && (
          <div className="nasa-drawer-chart">
            {RADIATION_BARS.map((bar) => (
              <div className="nasa-drawer-bar-row" key={bar.label}>
                <span className="nasa-drawer-bar-label">{bar.label}</span>
                <span className="nasa-drawer-bar-track">
                  <span
                    className="nasa-drawer-bar-fill"
                    style={{ width: `${(bar.mSvPerDay / maxBar) * 100}%` }}
                  />
                </span>
                <span className="nasa-drawer-bar-value">{bar.mSvPerDay} mSv/day</span>
              </div>
            ))}
          </div>
        )}

        {/* 3e. Lesson line */}
        <p className="nasa-drawer-lesson">LESSON: {content.lesson}</p>

        {/* 3f. Source line + link */}
        <p className="nasa-drawer-source">
          Source: {content.sourceName}{' '}
          <a href={content.sourceUrl} target="_blank" rel="noopener noreferrer">
            Open source
          </a>
        </p>

        {/* 3g. Game-numbers disclaimer */}
        <p className="nasa-drawer-game-note">🟧 GAME NUMBERS: {content.gameNote}</p>
      </div>

      {/* ── 4. Scoped CSS (no theme.css yet, so styles live here) ── */}
      <style>{`
        .nasa-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: 40;
        }

        .nasa-drawer {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 8px;
          width: min(420px, 92vw);
          max-height: 70vh;
          overflow-y: auto;
          background: var(--bg, #1b1d27);
          color: var(--text-h, #f3f4f6);
          border: 1px solid var(--border, #2e303a);
          border-radius: 16px;
          box-shadow: var(--shadow, 0 10px 30px rgba(0, 0, 0, 0.45));
          padding: 20px;
          z-index: 41;
        }

        .nasa-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .nasa-drawer-header h2 {
          font-size: 18px;
          margin: 0;
        }

        .nasa-drawer-close {
          min-width: 48px;
          min-height: 48px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: inherit;
          font-size: 18px;
          cursor: pointer;
        }

        .nasa-drawer-close:focus-visible {
          outline: 2px solid var(--accent, #c084fc);
          outline-offset: 2px;
        }

        .nasa-drawer-badge,
        .nasa-drawer-game-note {
          font-weight: 600;
        }

        .nasa-drawer-title {
          font-size: 16px;
          margin: 12px 0 4px;
        }

        .nasa-drawer-text,
        .nasa-drawer-lesson,
        .nasa-drawer-source,
        .nasa-drawer-game-note {
          font-size: 16px;
          line-height: 145%;
          margin: 8px 0;
        }

        .nasa-drawer-chart {
          margin: 12px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nasa-drawer-bar-row {
          display: grid;
          grid-template-columns: 1fr 2fr auto;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .nasa-drawer-bar-track {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          height: 14px;
          overflow: hidden;
        }

        .nasa-drawer-bar-fill {
          display: block;
          height: 100%;
          background: var(--accent, #c084fc);
          border-radius: 6px;
        }

        .nasa-drawer-source a {
          color: var(--accent, #c084fc);
        }

        @media (max-width: 640px) {
          .nasa-drawer {
            position: fixed;
            inset: 0;
            margin: 0;
            width: 100%;
            max-height: 100%;
            height: 100%;
            border-radius: 0;
          }
        }
      `}</style>
    </>
  );
}
