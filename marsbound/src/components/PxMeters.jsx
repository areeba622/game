import { statusLabel } from '../game/game.js';
import { METER_INFO, SCIENCE_GOAL } from './kidText.js';
import PxIcon from './PxIcon.jsx';
import { METER_ICON8, STATUS_LOOK } from '../pixel/icons8.js';

const ORDER = ['O', 'W', 'P', 'C', 'S'];

// The five meters in the HUD: icon, name, value, and a status word + icon + colour.
// Oxygen / Water / Power / Crew Health use statusLabel() from the game rules.
// Science has no status in the rules, so it only shows the goal: Low until it reaches 15.
export default function PxMeters({ state }) {
  return (
    <ul className="pxw-meters" aria-label="Resources">
      {ORDER.map((key) => {
        const value = state[key];
        const science = key === 'S';
        const word = science ? (value >= SCIENCE_GOAL ? 'OK' : 'Low') : statusLabel(value).word;
        const look = STATUS_LOOK[word] ?? STATUS_LOOK.OK;
        return (
          <li key={key} className="pxw-meter" data-tone={look.tone}>
            <span className="pxw-meter__name">
              <PxIcon name={METER_ICON8[key]} />
              {METER_INFO[key].label}
            </span>
            <span className="pxw-meter__row">
              <b className="pxw-meter__value">
                {value}
                {science && <span className="pxw-meter__goal">/{SCIENCE_GOAL}</span>}
              </b>
              <span className={`pxw-status is-${look.tone}`}>
                <PxIcon name={look.icon} />
                {word.toUpperCase()}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
