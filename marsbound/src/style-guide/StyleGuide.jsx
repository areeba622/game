import { useState } from 'react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Chip from '../components/Chip.jsx';
import DialogueBox from '../components/DialogueBox.jsx';
import Icon from '../components/Icon.jsx';
import MeterBar from '../components/MeterBar.jsx';
import Modal from '../components/Modal.jsx';
import ResourceBar from '../components/ResourceBar.jsx';
import SceneBackdrop from '../components/SceneBackdrop.jsx';
import { ICON_NAMES } from '../components/icons/pixelMaps.js';

const TOKEN_GROUPS = [
  ['Panel tiers and bevel', ['panel-1-bg', 'panel-2-surface', 'panel-3-raised', 'bevel-light', 'bevel-dark']],
  ['Illustration shadow, midtones', ['shadow-warm', 'shadow-neutral', 'mid-hot', 'mid-ochre', 'mid-slate']],
  ['Highlights, glow, haze', ['hi-gold', 'hi-pale', 'glow-ember', 'glow-flare', 'glow-violet', 'glow-magenta', 'haze-dusty-sky']],
  ['Green and status ramp', ['green-deep', 'green-bright', 'status-healthy', 'status-ok', 'status-low', 'status-critical', 'status-empty']],
  ['Accent, meter identity, text', ['accent-signal', 'water-blue', 'text-primary', 'text-secondary']],
];

const TEXT_SIZES = [
  ['--text-body', 18],
  ['--text-emphasis', 20],
  ['--text-subhead', 24],
  ['--text-heading', 32],
  ['--text-hero', 40],
];

const SPACES = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-6', '--space-8'];

const METER_VALUES = [
  [100, 'Healthy'],
  [75, 'Healthy'],
  [55, 'OK'],
  [30, 'Low'],
  [12, 'Critical'],
  [3, 'Critical'],
  [0, 'Empty'],
];

const GROUPS = {
  Meters: ['oxygen', 'water', 'power', 'crew', 'science'],
  Statuses: ['status-healthy', 'status-ok', 'status-low', 'status-critical', 'status-empty'],
  Challenges: ['life-support', 'radiation', 'power-budget', 'greenhouse', 'earth-signal'],
  Interface: ['warning', 'check', 'close', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'shelter', 'sun', 'storm', 'radio', 'plant', 'satellite', 'star'],
  Extras: ['globe', 'die', 'moon', 'hourglass', 'sunrise'],
};

function readTokenValues() {
  const style = getComputedStyle(document.documentElement);
  const next = {};
  TOKEN_GROUPS.forEach(([, names]) =>
    names.forEach((name) => {
      next[name] = style.getPropertyValue(`--color-${name}`).trim();
    }),
  );
  return next;
}

function Section({ title, note, children }) {
  return (
    <section className="sg-section">
      <h2>{title}</h2>
      {note && <p className="sg-note">{note}</p>}
      {children}
    </section>
  );
}

function StatusRow({ className }) {
  return (
    <div className={`sg-cb ${className}`}>
      {['healthy', 'ok', 'low', 'critical', 'empty'].map((status) => (
        <span key={status} className={`mb-status mb-status--${status}`}>
          <Icon name={`status-${status}`} />
          <span className="mb-status__word">{status === 'ok' ? 'OK' : status[0].toUpperCase() + status.slice(1)}</span>
        </span>
      ))}
    </div>
  );
}

export default function StyleGuide() {
  const [values] = useState(readTokenValues);
  const [liveModal, setLiveModal] = useState(false);
  const [suggestion, setSuggestion] = useState('Nova');

  return (
    <main className="px sg">
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <defs>
          <filter id="sg-protan" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" />
          </filter>
          <filter id="sg-deutan" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
          </filter>
          <filter id="sg-tritan" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      <h1>MARSBOUND style guide</h1>
      <p className="sg-note">Dev only. Phase 2 foundation. Tokens from DESIGN.md, components in src/components.</p>

      <Section title="1. Colour tokens" note="Read from the live CSS variables on :root.">
        {TOKEN_GROUPS.map(([group, names]) => (
          <div key={group}>
            <h3>{group}</h3>
            <div className="sg-grid">
              {names.map((name) => (
                <div className="sg-swatch" key={name}>
                  <div className="sg-swatch__chip" style={{ background: `var(--color-${name})` }} />
                  <div className="sg-swatch__text">
                    {name}
                    <div className="sg-swatch__hex">{values[name]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="2. Type" note="One font: VT323 (Press Start 2P for big titles). Nothing under 18px.">
        <div className="sg-grid sg-grid--wide">
          <Card>
            <h3>--font-ui · VT323 (default)</h3>
            <p className="sg-type-ui">Mission Control: Oxygen is low.</p>
            <p className="sg-type-ui" style={{ fontWeight: 700 }}>Bold, for Low and Critical chips.</p>
          </Card>
          <Card>
            <h3>--font-reading · VT323 (NASA drawer text)</h3>
            <p className="sg-type-reading">A tool called RAD counts radiation on the ground. Mars has a thin air layer.</p>
          </Card>
          <Card>
            <h3>--font-stat · VT323 (values and Sol)</h3>
            <p className="sg-type-stat">75 · SOL 2</p>
          </Card>
          <Card>
            <h3>Digits at 18px (Inter)</h3>
            <p className="sg-type-ui" style={{ fontSize: 18 }}>0123456789 · +5 −5 +15 −12 · Sol 3</p>
            <h3>Same line again</h3>
            <p style={{ fontSize: 18, fontFamily: 'var(--font-pixel-only)' }}>0123456789 · +5 −5 +15 −12 · Sol 3</p>
          </Card>
          <Card>
            <h3>Glyph check, Inter</h3>
            <p className="sg-type-ui">−5 +20 · ’ “quote” 0.67 mSv</p>
            <p className="sg-type-ui sg-note">Not in the font (fall back): ← → ✓ ★</p>
          </Card>
        </div>
        {TEXT_SIZES.map(([token, px]) => (
          <p key={token} style={{ fontSize: `var(${token})`, margin: 'var(--space-1) 0' }}>
            {token} · {px}px
          </p>
        ))}
      </Section>

      <Section title="3. Spacing" note="8px grid. Radius is 0 everywhere.">
        {SPACES.map((token) => (
          <div key={token} className="sg-space">
            <div className="sg-space__bar" style={{ width: `var(${token})` }} />
            <span>{token}</span>
          </div>
        ))}
      </Section>

      <Section title="4. Icons (34 drawn 16×16 maps)" note="Each icon at 1×, 2× (the standard size) and 4×. No emoji, no letter boxes.">
        {Object.entries(GROUPS).map(([group, names]) => (
          <div key={group}>
            <h3>{group}</h3>
            <div className="sg-grid">
              {names.map((name) => (
                <div className="sg-icon-cell" key={name}>
                  <div className="sg-icon-cell__sizes">
                    <Icon name={name} scale={1} />
                    <Icon name={name} scale={2} label={name} />
                    <Icon name={name} scale={4} />
                  </div>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="sg-note">Registered: {ICON_NAMES.length} icons.</p>
      </Section>

      <Section title="5. Button" note="Default, hover, pressed, focus, disabled. Primary has the same states.">
        <div className="sg-row">
          <Button>Default</Button>
          <Button className="sg-hover">Hover</Button>
          <Button pressed>Pressed</Button>
          <Button className="sg-focus">Focus</Button>
          <Button disabled>Disabled</Button>
          <Button icon="arrow-left">With icon</Button>
        </div>
        <div className="sg-row">
          <Button variant="primary">Primary</Button>
          <Button variant="primary" className="sg-hover">Hover</Button>
          <Button variant="primary" pressed>Pressed</Button>
          <Button variant="primary" className="sg-focus">Focus</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="6. Card" note="Inset slot. Default, selected, done.">
        <div className="sg-grid sg-grid--wide">
          <Card>
            <h3>Default</h3>
            <p>Life Support</p>
          </Card>
          <Card state="selected">
            <h3>Selected</h3>
            <p>Radiation Shelter</p>
          </Card>
          <Card state="done">
            <h3>Done</h3>
            <p>Power Budget · Option A</p>
          </Card>
        </div>
      </Section>

      <Section title="7. Chip" note="Gain and cost use a left-edge accent. The +/- sign and the meter icon are always shown.">
        <div className="sg-row">
          <Chip variant="warning" icon="warning">Costs 8 Oxygen each night if not done</Chip>
          <Chip variant="cost" icon="water">−12</Chip>
          <Chip variant="cost" icon="power">−15</Chip>
          <Chip variant="gain" icon="oxygen">+20</Chip>
          <Chip variant="gain" icon="crew">+5</Chip>
          <Chip variant="gain" icon="science">+2</Chip>
        </div>
        <div className="sg-row">
          <Chip variant="real">REAL NASA</Chip>
          <Chip variant="game">GAME NUMBERS</Chip>
        </div>
        <div className="sg-row">
          {['Nova', 'Comet', 'Orbit'].map((name) => (
            <Chip key={name} variant="suggestion" pressed={suggestion === name} onClick={() => setSuggestion(name)}>
              {name}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="8. Meter bar" note="24px inset track, fill in steps of 5, value in the stat font, status icon plus word.">
        <div className="sg-grid sg-grid--wide" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {METER_VALUES.map(([value, word]) => (
            <MeterBar key={value} label={word === 'Healthy' && value === 75 ? 'Water' : 'Oxygen'} icon={word === 'Healthy' && value === 75 ? 'water' : 'oxygen'} value={value} word={word} />
          ))}
        </div>
        <h3 style={{ marginTop: 'var(--space-3)' }}>ResourceBar wrapper (same props as before: label, icon, value)</h3>
        <div className="sg-grid sg-grid--wide" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          <ResourceBar label="Power" value={36} />
          <ResourceBar label="Crew Health" value={82} />
        </div>
      </Section>

      <Section title="9. Status colour-blind check" note="Same five statuses through greyscale and three dichromacy approximations (sRGB matrices). The icon silhouette and the word carry the meaning when colours converge.">
        <h3>Normal</h3>
        <StatusRow className="" />
        <h3>Greyscale</h3>
        <StatusRow className="sg-cb--grey" />
        <h3>Protanopia</h3>
        <StatusRow className="sg-cb--protan" />
        <h3>Deuteranopia</h3>
        <StatusRow className="sg-cb--deutan" />
        <h3>Tritanopia</h3>
        <StatusRow className="sg-cb--tritan" />
      </Section>

      <Section title="10. Modal" note="Shell only. The live one keeps the existing focus trap and Escape.">
        <div className="mb-modal" style={{ maxWidth: 480 }}>
          <p className="sg-note">YOU SELECTED:</p>
          <h3 style={{ color: 'var(--color-text-primary)' }}>B. Surround the shelter with water</h3>
          <div className="mb-danger">CAREFUL! If you choose this, the mission ends.</div>
          <div className="sg-row" style={{ marginBottom: 0 }}>
            <Button variant="primary">Confirm</Button>
            <Button>Change choice</Button>
          </div>
        </div>
        <div className="sg-row" style={{ marginTop: 'var(--space-2)' }}>
          <Button onClick={() => setLiveModal(true)}>Open the live Modal</Button>
        </div>
        {liveModal && (
          <Modal label="Live modal" onClose={() => setLiveModal(false)}>
            <p>Backdrop is the dark panel at 70%. Tab stays inside. Escape closes.</p>
            <Button variant="primary" onClick={() => setLiveModal(false)}>Close</Button>
          </Modal>
        )}
      </Section>

      <Section title="11. Dialogue box" note="Static text and Next. No typewriter in this phase.">
        <DialogueBox
          speaker="Mission Control"
          lines={['Commander Nova, pick two jobs for today.', 'A storm is coming at the end of Sol 2.']}
          onNext={() => {}}
        />
      </Section>

      <Section title="12. Scene backdrop" note="CSS only, fixed on real screens (shown contained here). Title, Dashboard, Sol Summary dusk.">
        <div className="sg-grid sg-grid--wide" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {['title', 'dashboard', 'summary'].map((variant) => (
            <div className="sg-box" key={variant}>
              <SceneBackdrop variant={variant} contained />
              <h3>{variant}</h3>
              <p>Text sits on the backdrop here only to check contrast.</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
