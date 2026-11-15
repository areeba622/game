import { CHALLENGES } from '../../../game/challenges.js';
import { CHALLENGE_ORDER } from '../../kidText.js';
import RoomArt from '../RoomArt.jsx';
import { Chip, Panel, Pill, Tile, WidgetFrame } from '../ui.jsx';

// The five challenges. Titles, intros and option names come straight from CHALLENGES.
export default function Challenges({ w, patch, onNext }) {
  const sel = w.chalSel !== null ? CHALLENGES[CHALLENGE_ORDER[w.chalSel]] : null;
  const pick = (i) => patch((p) => ({ chalSel: i, chal: p.chal.includes(i) ? p.chal : [...p.chal, i] }));
  return (
    <WidgetFrame done={w.chal.length === CHALLENGE_ORDER.length} hint={`Read all ${CHALLENGE_ORDER.length} briefings (${w.chal.length}/${CHALLENGE_ORDER.length})`} onNext={onNext}>
      <div className="pi-tiles">
        {CHALLENGE_ORDER.map((id, i) => (
          <Tile key={id} selected={w.chalSel === i} ok={w.chal.includes(i)} onClick={() => pick(i)} label={CHALLENGES[id].title}>
            <RoomArt id={id} />
            <Pill>{CHALLENGES[id].title.toUpperCase()}</Pill>
          </Tile>
        ))}
      </div>
      <Panel cls="pi-detail dim">
        {sel ? (
          <>
            <span className="pi-peach">{sel.title.toUpperCase()}:</span> {sel.intro}
            <div className="pi-chips">
              {Object.entries(sel.options).map(([letter, o]) => (
                <Chip key={letter} kind="info">
                  {letter}. {o.title.toUpperCase()}
                </Chip>
              ))}
            </div>
          </>
        ) : (
          'Tap a challenge for its briefing.'
        )}
      </Panel>
    </WidgetFrame>
  );
}
