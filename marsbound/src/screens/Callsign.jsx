import { useState } from 'react';
import '../styles/pixel-title.css';
import Icon from '../components/Icon.jsx';
import TitleScene from '../components/TitleScene.jsx';

// Screen 2 — Callsign (CLAUDE.md 8.1, docs/WIREFRAMES.md).
// The nickname lives in memory only: no localStorage, cookies or server.

const CHIPS = ['Nova', 'Comet', 'Orbit'];
const ERROR_TEXT = 'Use 2 to 16 letters or numbers';
// Letters (any language, with accents), digits, spaces, - and _. No emoji or other symbols.
const ALLOWED = /^[\p{L}\p{M}\p{Nd} _-]+$/u;

function cleanName(raw) {
  return raw.trim().replace(/\s+/g, ' ');
}

function isValidName(name) {
  const length = [...name].length;
  // At least one letter or digit, so a name of only "-" or "_" is not accepted.
  return length >= 2 && length <= 16 && ALLOWED.test(name) && /[\p{L}\p{Nd}]/u.test(name);
}

export default function Callsign({ actions }) {
  const [nickname, setNickname] = useState('');
  const [showError, setShowError] = useState(false);

  function handleContinue(e) {
    e.preventDefault();
    const name = cleanName(nickname);
    if (!isValidName(name)) {
      setShowError(true);
      return;
    }
    actions.startMission(name);
  }

  function handleChange(e) {
    setNickname(e.target.value);
    setShowError(false);
  }

  function fillChip(name) {
    setNickname(name);
    setShowError(false);
  }

  return (
    <main className="ts cs">
      <TitleScene />
      <div className="cs-stage">
        <form className="cs-panel" onSubmit={handleContinue} noValidate>
          <h1 id="callsign-question" className="cs-question">
            What should we call you, Commander?
          </h1>

          <input
            type="text"
            className="cs-input"
            value={nickname}
            onChange={handleChange}
            aria-labelledby="callsign-question"
            aria-describedby={showError ? 'callsign-hint callsign-error' : 'callsign-hint'}
            aria-invalid={showError}
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            placeholder="Nickname"
          />
          <p id="callsign-hint" className="cs-hint">
            Use a nickname, not your real name.
          </p>

          <div className="cs-chips">
            <span className="cs-try">Try:</span>
            {CHIPS.map((name) => (
              <button
                key={name}
                type="button"
                className="cs-chip"
                aria-pressed={cleanName(nickname) === name}
                onClick={() => fillChip(name)}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="cs-actions">
            <button type="submit" className="ts-btn">
              Continue
            </button>
            <button type="button" className="ts-link" onClick={() => actions.startMission('Commander')}>
              Skip
            </button>
          </div>

          {showError && (
            <p id="callsign-error" className="cs-error" role="alert">
              <Icon name="warning" scale={1} /> {ERROR_TEXT}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
