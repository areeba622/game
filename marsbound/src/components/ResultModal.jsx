import { CHALLENGES } from '../game/challenges.js';
import Modal from './Modal.jsx';
import EffectChips from './EffectChips.jsx';

// Result pop-up: what changed, a short "what happened" line, and the real-NASA
// lines from docs/WIREFRAMES.md where they apply. Continue calls onContinue
// (actions.continueAfterResult); this pop-up never decides the next screen.
export default function ResultModal({ state, cid, opt, onContinue }) {
  const option = CHALLENGES[cid].options[opt];
  const isLastSol = state.sol >= 3;
  const event = state.event;

  return (
    <Modal label="Decision complete">
      <h2 className="modal__title modal__title--center">DECISION COMPLETE</h2>
      <p className="modal__chosen">
        You chose: {opt}. {option.title}
      </p>

      <p className="modal__chips">
        <EffectChips effects={option.effects} />
      </p>

      <h3 className="modal__heading">WHAT HAPPENED</h3>
      {/* TODO: replace with a short result line per option once docs/KID_TEXT.md has them. */}
      <p>{option.text}</p>

      {cid === 'R' && event && (
        <p className="modal__nasa">
          <span aria-hidden="true">🌩</span> “This storm is based on a real NASA record: an {event.classType} flare on{' '}
          {event.date}.” <span className="badge badge-real">🟦 REAL NASA</span>
        </p>
      )}
      {cid === 'G' && (
        <p className="modal__nasa">
          <span aria-hidden="true">🌱</span>{' '}
          {isLastSol
            ? '“Plants need time. The harvest comes after the mission ends.”'
            : '“Plants are growing. Harvest at the start of the next Sol.”'}
        </p>
      )}
      {cid === 'M' && (
        <p className="modal__nasa">
          <span aria-hidden="true">📡</span>{' '}
          {isLastSol
            ? '“Message sent. Earth’s reply comes after the mission ends.”'
            : '“Message sent. A reply comes next Sol.”'}{' '}
          “Real signals take about 4 to 24 minutes one way.” <span className="badge badge-real">🟦 REAL NASA</span>
        </p>
      )}

      <div className="modal__actions">
        <button type="button" className="btn-primary" onClick={onContinue}>
          Continue
        </button>
      </div>
    </Modal>
  );
}
