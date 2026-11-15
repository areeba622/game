import { CHAPTERS } from './introScript.js';
import { Btn, Panel } from './ui.jsx';

// Top bar: Back, which chapter we are in (words and squares), and Skip intro.
export default function ChapterHud({ chapter, onBack, onSkip }) {
  return (
    <Panel cls="pi-hud">
      <Btn cls="sm" onClick={onBack}>
        Back
      </Btn>
      <div className="pi-hmid">
        <div className="pi-hl">
          CHAPTER {chapter + 1} / {CHAPTERS.length} <b>{CHAPTERS[chapter][0].toUpperCase()}</b>
        </div>
        <div
          className="pi-slots"
          role="progressbar"
          aria-label="Intro progress"
          aria-valuemin={1}
          aria-valuemax={CHAPTERS.length}
          aria-valuenow={chapter + 1}
        >
          {CHAPTERS.map((c, i) => (
            <i key={c[0]} className={`pi-sq ${i < chapter ? 'done' : i === chapter ? 'cur' : ''}`} />
          ))}
        </div>
      </div>
      <Btn cls="sm" onClick={onSkip}>
        Skip intro
      </Btn>
    </Panel>
  );
}
