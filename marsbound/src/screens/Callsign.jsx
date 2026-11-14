import { useState } from 'react';

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
  return length >= 2 && length <= 16 && ALLOWED.test(name);
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
    <main className="screen screen-callsign">
      <form className="card callsign-card" onSubmit={handleContinue} noValidate>
        <h1 id="callsign-question" className="callsign-question">
          What should we call you, Commander?
        </h1>

        <input
          type="text"
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
        <p id="callsign-hint" className="callsign-hint">
          Use a nickname, not your real name.
        </p>

        <div className="callsign-chips">
          <span className="callsign-try">Try:</span>
          {CHIPS.map((name) => (
            <button
              key={name}
              type="button"
              className="chip"
              aria-pressed={cleanName(nickname) === name}
              onClick={() => fillChip(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="callsign-actions">
          <button type="submit" className="btn-primary">
            Continue
          </button>
          <button type="button" onClick={() => actions.startMission('Commander')}>
            Skip
          </button>
        </div>

        {showError && (
          <p id="callsign-error" className="callsign-error" role="alert">
            <span aria-hidden="true">⚠</span> {ERROR_TEXT}
          </p>
        )}
      </form>
    </main>
  );
}