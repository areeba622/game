import { CHALLENGES } from '../game/challenges.js';
import { previewChoice } from '../game/game.js';
import Modal from './Modal.jsx';
import EffectChips from './EffectChips.jsx';
import { METER_INFO, NIGHT_NOTE } from './kidText.js';

const ROWS = ['O', 'W', 'P', 'C', 'S'];
const ARRIVING_LABEL = { G: 'Greenhouse harvest', M: "Earth's reply" };

function nightNote(state, cid, opt) {
  const doneAfter = { ...state.done, [cid]: opt };
  const shelteredAfter =
    state.sheltered || (cid === 'R' && CHALLENGES.R.options[opt].sheltered && state.sol <= 2);

  const extras = [];
  if (!doneAfter.L) extras.push(`${NIGHT_NOTE.lifeSupportMissing} (Life Support not done)`);
  if (!doneAfter.W) extras.push(`${NIGHT_NOTE.powerBudgetMissing} (Power Budget not done)`);

  let text = `Includes the night: upkeep ${NIGHT_NOTE.upkeep}`;
  if (extras.length > 0) text += `, plus extra ${extras.join(' and ')}`;
  text += '.';
  if (state.sol === 1) text += ' Storm: not yet.';
  if (state.sol === 2) {
    text += shelteredAfter
      ? ' Storm: your crew is sheltered.'
      : ` Storm: Crew Health −${NIGHT_NOTE.stormDamage[state.severity]}.`;
  }
  return text;
}

// Confirm pop-up (CLAUDE.md section 6). Nothing changes until Confirm.
export default function ConfirmModal({ state, cid, opt, onConfirm, onCancel }) {
  const option = CHALLENGES[cid].options[opt];
  const preview = previewChoice(state, cid, opt);
  const { after, includesNight, arriving, failed, failReason } = preview;
  const isLastSol = state.sol >= 3;

  return (
    <Modal label="Confirm your choice" onClose={onCancel}>
      <p className="modal__small">YOU SELECTED:</p>
      <h2 className="modal__title">
        {opt}. {option.title}
      </h2>

      <table className="preview-table">
        <caption className="sr-only">Meters before and after this choice</caption>
        <thead>
          <tr>
            <th scope="col">Meter</th>
            <th scope="col">NOW</th>
            <th scope="col" aria-hidden="true"></th>
            <th scope="col">{includesNight ? 'AFTER TONIGHT' : 'AFTER'}</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((key) => {
            const now = state[key];
            const next = after[key];
            const changed = now !== next;
            return (
              <tr key={key} className={changed ? 'is-changed' : ''}>
                <th scope="row">
                  <span aria-hidden="true">{METER_INFO[key].icon}</span> {METER_INFO[key].label}
                </th>
                <td>{now}</td>
                <td aria-hidden="true">{changed ? '→' : ''}</td>
                <td>{changed ? next : <span className="preview-table__same">no change</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {includesNight && <p className="modal__note">{nightNote(state, cid, opt)}</p>}

      {includesNight && arriving.length > 0 && (
        <p className="modal__note">
          <strong>Arriving tomorrow:</strong>{' '}
          {arriving.map((entry, i) => (
            <span key={i} className="modal__arriving">
              {ARRIVING_LABEL[entry.cid] ?? 'Arrival'} <EffectChips effects={entry.effects} />
            </span>
          ))}
        </p>
      )}

      {cid === 'R' && option.sheltered && !isLastSol && (
        <p className="modal__note is-safe">
          <span aria-hidden="true">☂</span> The crew will be sheltered from the storm.
        </p>
      )}

      {failed && (
        <p className="warning-danger" role="alert">
          <span aria-hidden="true">⚠</span> CAREFUL! If you choose this, the mission ends.
          {failReason ? ` The crew would run out of ${failReason}.` : ''}
        </p>
      )}
      {isLastSol && cid === 'G' && (
        <p className="warning-danger">
          <span aria-hidden="true">⚠</span> Plants need time. This harvest comes after the mission ends.
        </p>
      )}
      {isLastSol && cid === 'M' && (
        <p className="warning-danger">
          <span aria-hidden="true">⚠</span> Earth's reply comes after the mission ends.
        </p>
      )}

      <div className="modal__actions">
        <button type="button" className="btn-primary" onClick={onConfirm}>
          Confirm
        </button>
        <button type="button" onClick={onCancel}>
          Change choice
        </button>
      </div>
    </Modal>
  );
}
